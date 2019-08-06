const async = require('async')
const Promise = require('promise')
const AccTreeDB = require('./secjs-accTree.js')
const geneData = require('./genesisBlock.js')
const SECUtils = require('@biut-block/biutjs-util')
const SECTokenBlock = require('./secjs-token-block')
const SECDatahandler = require('@biut-block/biutjs-datahandler')
const SECMerkleTree = require('@biut-block/biutjs-merkle-tree')
const vm = require('vm')
const cloneDeep = require('clone-deep')
const Big = require('bignumber.js')

const DEC_NUM = 8
Big.config({
  ROUNDING_MODE: 0
})
Big.set({
  ROUNDING_MODE: Big.ROUND_DOWN
})

class SECTokenBlockChain {
  /**
   * create a token chain block chain with config
   * @param {config} config
   *
   */

  constructor(config, pool) {
    this.deletingFlag = false
    this.chainName = config.chainName
    this.chainDB = new SECDatahandler.TokenBlockChainDB(config.dbconfig)
    this.txDB = new SECDatahandler.TokenTxDB(config.dbconfig)
    this.smartContractTxDB = new SECDatahandler.SmartContractTxDB(config.dbconfig)
    this.accTree = new AccTreeDB(Object.assign(config.dbconfig, {
      "chainName": this.chainName
    }))
    this.chainLength = 0
    this.pool = pool
  }
  /**
   * generate genesis token block
   */
  _generateGenesisBlock() {
    if (process.env.netType === 'test' && this.chainName === 'SEC') {
      return new SECTokenBlock(geneData.secTestGeneBlock).getBlock()
    } else if (process.env.netType === 'test' && this.chainName === 'SEN') {
      return new SECTokenBlock(geneData.senTestGeneBlock).getBlock()
    } else if (process.env.netType === 'develop' && this.chainName === 'SEC') {
      return new SECTokenBlock(geneData.secDevGeneBlock).getBlock()
    } else if (process.env.netType === 'develop' && this.chainName === 'SEN') {
      return new SECTokenBlock(geneData.senDevGeneBlock).getBlock()
    } else if (this.chainName === 'SEC') {
      return new SECTokenBlock(geneData.secGeneBlock).getBlock()
    } else if (this.chainName === 'SEN') {
      return new SECTokenBlock(geneData.senGeneBlock).getBlock()
    }
  }

  /**
   * Initialize the class token-blockchain
   * @param {callback} callback - The callback that handles the response.
   */
  init(callback) {
    this.chainDB.isTokenBlockChainDBEmpty((err, isEmpty) => {
      if (err) throw new Error('Could not check db content')
      else if (isEmpty) {
        // if tokenDB is empty, then firstly clear the account tree DB
        this.accTree.clearDB((err) => {
          if (err) callback(err)
          else {
            // then write genesis block to both tokenDB and account tree DB
            let geneBlock = this._generateGenesisBlock()
            this.putBlockToDB(geneBlock, callback)
          }
        })
      } else {
        // if tokenDB is not empty, then firstly get the chain length
        this._getAllBlockChainFromDB(() => {
          // then check consistent of the chain
          this._consistentCheck((err, errPosition) => {
            if (err) {
              // do nothing
            }
            if (errPosition !== -1) {
              this.deletingFlag = true
              this.delBlockFromHeight(errPosition, (err) => {
                if (err) {
                  return callback(err)
                } else {
                  this.verifyStateRoot(callback)
                }
              })
            } else {
              this.verifyStateRoot(callback)
            }
          })
        })
      }
    })
  }

  verifyStateRoot(callback) {
    this.getLastBlock((err, block) => {
      if (err) callback(err)
      else {
        let root = block.StateRoot
        // check if the given root exists
        this.accTree.checkRoot(root, (err, result) => {
          // if it doesnt exist or error occurs:
          if (err || !result) {
            this.rebuildAccTree(callback)
          } else {
            // otherwise, create a new merkle tree which starts from the given root
            this.accTree.newTree(root)
            callback()
          }
        })
      }
    })
  }

  rebuildAccTree(callback) {
    console.log('Rebuilding Acctree...')
    // clear DB
    this.accTree.clearDB((err) => {
      if (err) callback(err)
      else {
        // update account tree db with whole token block chain
        this.chainDB.getTokenBlockChainDB((err, chain) => {
          if (err) {
            callback(err)
          } else {
            this._initAccTree(chain, (err) => {
              if (err) {
                callback(err)
              } else {
                this.accTree.updateWithBlockChain(chain, (err1) => {
                  if (err1) {
                    callback(err1)
                  } else {
                    callback()
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  _initAccTree(chain, callback) {
    async.eachSeries(chain, (block, cb) => {
      let count = 0
      let txLength = block.Transactions.length
      if (txLength === 0) {
        cb()
      } else {
        block.Transactions.forEach((tx) => {
          let contractAddr = ''
          if (SECUtils.isContractAddr(tx.TxTo)) {
            contractAddr = tx.TxTo
          } else {
            contractAddr = tx.TxFrom
          }
          this.getTokenName(contractAddr, (err1, tokenName) => {
            if (err1) {
              return cb(err1)
            }
            tokenName = this._checkSecSubContract(tokenName)
            tx.TokenName = tokenName
            count++
            if (count >= txLength) {
              return cb()
            }
          })
        })
      }
    }, (err2) => {
      callback(err2)
    })
  }

  verifyParentHash(block, callback) {
    if (block.Number !== 0) {
      this.getBlock(block.Number - 1, (err, lastblock) => {
        if (err) callback(err, null)
        else {
          if (block.ParentHash !== lastblock.Hash) {
            console.log(`Invalid Parent Hash: ${block.ParentHash}, which should be ${lastblock.Hash}`)
            return callback(null, false)
          }
          callback(null, true)
        }
      })
    } else {
      callback(null, true)
    }
  }

  verifyDifficulty(block, callback) {
    let difficulty = parseFloat(block.Difficulty)
    if (block.Number > 1) {
      if (difficulty < 2048) {
        let e = new Error(`Invalid difficulty value(${difficulty}), must be larger than 2048`)
        return callback(e)
      }

      this.getBlock(block.Number - 1, (err, lastblock) => {
        if (err) callback(err)
        else {
          let lastDiff = parseFloat(lastblock.Difficulty)
          let adjustDiff = Math.round(Math.pow(2, (Math.floor(lastblock.Number / 100000) - 2)))
          let difference = lastDiff + Math.floor(lastDiff / 2048) + adjustDiff
          if (Math.abs(difficulty - lastDiff) > difference) {
            let e = new Error(`Invalid block difficulty, difficulty difference is ${Math.abs(difficulty - lastDiff)}, but should be smaller than ${difference}`)
            return callback(e)
          }
          callback()
        }
      })
    } else {
      callback()
    }
  }

  verifyTxRoot(block) {
    // verify block header transaction root
    let txHashArray = []
    block['Transactions'].forEach(tx => {
      txHashArray.push(tx.TxHash)
    })

    let txRoot = ''
    if (txHashArray.length === 0) {
      txRoot = SECUtils.KECCAK256_RLP.toString('hex')
    } else {
      let merkleTree = new SECMerkleTree(txHashArray, 'sha256')
      txRoot = merkleTree.getRoot().toString('hex')
    }

    if (txRoot === block['TransactionsRoot']) {
      return true
    }
    return false
  }

  _consistentCheck(callback) {
    this.getHashList((err, hashList) => {
      if (err) {
        return callback(err, 1)
      } else {
        let errPosition = -1
        try {
          hashList.forEach((data, index) => {
            if (data === undefined) {
              errPosition = index
              throw new Error(`HashList data undefined, consistentcheck Failed, Error Position: ${errPosition}`)
            }
            if (data.Number === undefined || data.Hash === undefined || data.ParentHash === undefined) {
              errPosition = index
              throw new Error(`HashList data subobject undefined, consistentcheck Failed, Error Position: ${errPosition}`)
            }

            // block number consistent check
            if (data.Number !== index) {
              errPosition = index
              throw new Error(`HashList data.Number not right, consistentcheck Failed, Error Position: ${errPosition}`)
            }

            // parent hash consistent check
            if (index > 0) {
              if (data.ParentHash !== hashList[index - 1].Hash) {
                errPosition = index
                throw new Error(`HashList Hash and ParentHash not right, consistentcheck Failed, Error Position: ${errPosition}`)
              }
            }
          })
          return callback(null, -1)
        } catch (err) {
          return callback(err, errPosition)
        }
      }
    })
  }

  /**
   * Put token block to db
   * @param {SECTokenBlock} block the block object in json formation
   * @param {callback} callback
   */
  putBlockToDB(_block, callback) {
    if (this.deletingFlag) return callback(new Error('Now deleting block, can not write block into database.'))
    this._consistentCheck((err, errPosition) => {
      if (err) {
        console.error(err)
        return callback(new Error('Put Block to DB, Consistent check error.'))
      }
      if (errPosition !== -1) {
        this.deletingFlag = true
        this.delBlockFromHeight(errPosition, callback)
      } else {
        // write a new block to DB
        let block = JSON.parse(JSON.stringify(_block))
        // parse block.Transactions
        block.Transactions.forEach((tx, index) => {
          if (typeof tx === 'string') {
            block.Transactions[index] = JSON.parse(tx)
            block.Transactions[index].BlockNumber = block.Number
            block.Transactions[index].BlockHash = block.Hash
          }
        })


        if (!this.verifyTxRoot(block)) {
          return callback(new Error('Failed to verify transaction root'))
        }

        // verify parent hash
        this.verifyParentHash(block, (err, result) => {
          if (err) return callback(err)
          if (this.deletingFlag) return callback(new Error('Now deleting block, can not write block into database.'))
          // this.verifyDifficulty(block, (err) => {
          //   if (err) return callback(err)
          if (!result) {
            // do nothing if failed to verify parent hash
            callback(new Error('Failed to verify parent hash'))
          } else if (block.Number === this.chainLength) {
            // new block received, update tokenTxDB
            this.txDB.writeBlock(block, (err) => {
              if (err) return callback(err)
              let smartContractBlock = cloneDeep(block)
              this.updateSmartContractDB(smartContractBlock, (err, _smartContractBlock) => {
                if (err) return callback(err)
                // update token blockchain DB
                this.accTree.updateWithBlock(_smartContractBlock, (err) => {
                  if (err) return callback(err)
                  if (_smartContractBlock.Number != 0) {
                    let newStateRoot = this.accTree.getRoot()
                    _smartContractBlock.StateRoot = newStateRoot
                    block.StateRoot = newStateRoot
                  }
                  this.chainDB.writeTokenBlockToDB(cloneDeep(block), (err) => {
                    if (err) return callback(err)
                    this.chainLength = block.Number + 1
                    callback(null, block.StateRoot)
                  })
                })
              })
            })
          } else {
            callback(new Error(`Can not add token Block, token Block Number is false, block.Number: ${block.Number}, this.chainLength: ${this.chainLength}`))
          }
        })
      }
    })
  }

  delBlockFromHeight(height, callback) {
    let indexArray = []
    let revertTxArray = []

    this.getHashList((err, hashList) => {
      if (err) {
        setTimeout(() => {
          this.deletingFlag = false
        }, 1000)
        return callback(err, [])
      } else {
        for (let i = height; i <= hashList[hashList.length - 1].Number; i++) {
          if (hashList[i] !== undefined) {
            if (hashList[i].Number !== undefined) {
              indexArray.push(hashList[i].Number)
            }
          }
        }

        async.eachSeries(indexArray, (i, cb) => {
          // get block from db
          this.getBlock(i, (err, dbBlock) => {
            if (err) {
              console.error(`delBlockFromHeight function: Error occurs when try to get block, block number is ${i}`)
              return cb()
            }

            // update tx DB
            this.txDB.delBlock(dbBlock, (err1) => {
              if (err1) return cb(err1)
              // update token chain DB
              this.chainDB.delBlock(dbBlock, (err2) => {
                if (err2) return cb(err2)
                // update account tree DB
                this.accTree.revertWithBlock(dbBlock, (err3) => {
                  if (err3) return cb(err3)
                  dbBlock.Transactions.forEach((tx) => {
                    tx.TxReceiptStatus = 'pending'
                    if (tx.TxFrom !== '0000000000000000000000000000000000000000') {
                      revertTxArray.push(tx)
                    }
                  })
                  cb()
                })
              })
            })
          })
        }, (err) => {
          if (err) {
            setTimeout(() => {
              this.deletingFlag = false
            }, 1000)
            return callback(err, [])
          } else {
            setTimeout(() => {
              this.deletingFlag = false
            }, 1000)
            this.chainLength = height
            this._consistentCheck((err, errPosition) => {
              if (err) {
                // do nothing
              }
              if (errPosition !== -1) {
                this.deletingFlag = true
                this.delBlockFromHeight(errPosition, callback)
              } else {
                callback(err, revertTxArray)
              }
            })
          }
        })
      }
    })
  }

  /**
   * get Token Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHash(hashArray, callback) {
    this.chainDB.getTokenBlockFromDB(hashArray, callback)
  }

  /**
   * get all blockchain data
   */
  _getAllBlockChainFromDB(callback) {
    this.chainDB.getTokenBlockChainDB((err, blockchain) => {
      if (err) {
        callback(err, null)
      } else {
        this.chainLength = blockchain.length
        callback(null, blockchain)
      }
    })
  }

  /**
   * return last block's height
   */
  getCurrentHeight() {
    return this.chainLength - 1
  }

  getBlocksFromDB(minHeight, maxHeight = this.getCurrentHeight(), callback) {
    if (maxHeight > this.getCurrentHeight()) {
      maxHeight = this.getCurrentHeight()
    }
    this.chainDB.getTokenChain(minHeight, maxHeight, callback)
  }

  getBlock(num, callback) {
    this.chainDB.getBlock(num, (err, block) => {
      if (err) {
        callback(err, null)
      } else {
        if (typeof block === 'string') {
          block = JSON.parse(block)
        }
        if (typeof block.Transactions === 'string') {
          block.Transactions = JSON.parse(block.Transactions)
        }

        // parse block.Transactions
        block.Transactions.forEach((tx, index) => {
          if (typeof tx === 'string') {
            block.Transactions[index] = JSON.parse(tx)
          }
        })

        callback(null, block)
      }
    })
  }

  /**
   * get genesis block
   */
  getGenesisBlock(callback) {
    this.getBlock(0, callback)
  }

  /**
   * get last block
   */
  getLastBlock(callback) {
    this.getBlock(this.chainLength - 1, callback)
  }

  /**
   * get the second last block
   */
  getSecondLastBlock(callback) {
    if (this.chainLength <= 1) {
      let err = new Error('this.chainLength <= 1, failed to get second last block')
      return callback(err, null)
    }
    this.getBlock(this.chainLength - 2, callback)
  }

  getHashList(callback) {
    this.chainDB.getHashList(callback)
  }

  // -------------------------  SMART CONTRACT TX DB FUNCTIONS  ------------------------
  addTokenMap(tokenInfo, contractAddress, callback) {
    this.smartContractTxDB.addTokenMap(tokenInfo, contractAddress, callback)
  }

  deleteTokenMap(contractAddress, callback) {
    this.smartContractTxDB.deleteTokenMap(tokenInfo, contractAddress, callback)
  }

  getContractAddress(tokenName, callback) {
    this.smartContractTxDB.getContractAddress(tokenName, callback)
  }

  getTokenName(addr, callback) {
    if (SECUtils.isContractAddr(addr)) {
      this.smartContractTxDB.getTokenName(addr, (err, tokenName) => {
        if (err) return callback(new Error(`Token name of address ${addr} cannot be found in database`), null)
        callback(null, tokenName)
      })
    } else {
      callback(null, this.chainName)
    }
  }

  getCreatorContract(creatorAddress, callback) {
    this.smartContractTxDB.getCreatorContract(creatorAddress, callback)
  }

  getSourceCode(addr, callback) {
    if (SECUtils.isContractAddr(addr)) {
      this.smartContractTxDB.getSourceCode(addr, (err, sourceCode) => {
        if (err) return callback(new Error(`Token name of address ${addr} cannot be found in database`), null)
        callback(null, sourceCode)
      })
    } else {
      callback(null, '')
    }
  }

  getApprove(addr, callback) {
    if (SECUtils.isContractAddr(addr)) {
      this.smartContractTxDB.getApprove(addr, (err, approve) => {
        if (err) return callback(new Error(`Token name of address ${addr} cannot be found in database`), null)
        callback(null, approve)
      })
    } else {
      callback(null, {})
    }
  }

  getTimeLock(addr, callback) {
    if (SECUtils.isContractAddr(addr)) {
      this.smartContractTxDB.getTimeLock(addr, (err, timeLock) => {
        if (err) return callback(new Error(`Token name of address ${addr} cannot be found in database`), null)
        callback(null, timeLock)
      })
    } else {
      callback(null, {})
    }
  }

  getTokenInfo(addr, callback) {
    if (SECUtils.isContractAddr(addr)) {
      this.smartContractTxDB.getTokenInfo(addr, (err, tokenInfo) => {
        if (err) return callback(new Error(`Token name of address ${addr} cannot be found in database`), null)
        callback(null, tokenInfo)
      })
    } else {
      callback(null, {})
    }
  }

  async updateSmartContractDB(block, callback) {
    let self = this
    let transactionsList = []
    // parse block.Transactions
    block.Transactions.forEach((tx, index) => {
      if (typeof tx === 'string') {
        block.Transactions[index] = JSON.parse(tx)
      }
      if (!this._typeCheck(block.Transactions[index].Value)) {
        block.Transactions[index].Value = '0'
      }
      if (!this._typeCheck(block.Transactions[index].TxFee)) {
        block.Transactions[index].TxFee = '0'
      }
    })

    let txs = block.Transactions
    // txs.forEach((tx) => {
    //   promiseList.push(self._updateSmartContractDBWithTx(tx))
    // })

    // Promise.all(promiseList).then((transactionsList) => {
    //   if (transactionsList.length > 0) {
    //     transactionsList = transactionsList.reduce((a, b) => [...a, ...b])
    //   }
    //   block.Transactions = transactionsList
    //   callback(null, block)
    // }).catch((err) => {
    //   callback(err, null)
    // })
    try {
      await self._asyncForEach(txs, async (tx) => {
        transactionsList = transactionsList.concat(await self._updateSmartContractDBWithTx(tx))
      })
      block.Transactions = transactionsList
      callback(null, block)
    } catch (err) {
      callback(err, null)
    }
  }

  async revertSmartContractDB(block, callback) {
    let self = this
    let promiseList = []
    // parse block.Transactions
    block.Transactions.forEach((tx, index) => {
      if (typeof tx === 'string') {
        block.Transactions[index] = JSON.parse(tx)
      }
      if (!this._typeCheck(block.Transactions[index].Value)) {
        block.Transactions[index].Value = '0'
      }
      if (!this._typeCheck(block.Transactions[index].TxFee)) {
        block.Transactions[index].TxFee = '0'
      }
    })

    let txs = block.Transactions
    // txs.forEach((tx) => {
    //   promiseList.push(self._revertSmartContractDBWithTx(tx))
    // })

    // Promise.all(promiseList).then((transactionsList) => {
    //   if (transactionsList.length > 0) {
    //     transactionsList = transactionsList.reduce((a, b) => [...a, ...b])
    //   }
    //   block.Transactions = transactionsList
    //   callback(null, block)
    // }).catch((err) => {
    //   callback(err, null)
    // })
    try {
      await self._asyncForEach(txs, async (tx) => {
        transactionsList = transactionsList.concat(await self._revertSmartContractDBWithTx(tx))
      })
      block.Transactions = transactionsList
      callback(null, block)
    } catch (err) {
      callback(err, null)
    }
  }

  _updateSmartContractDBWithTx(tx) {
    let self = this
    let oInputData
    return new Promise(function (resolve, reject) {
      if (SECUtils.isContractAddr(tx.TxTo)) {
        try {
          oInputData = JSON.parse(tx.InputData)
        } catch (error) {
          reject(new Error('Invalid Smart Contract Call'))
        }
        self.getTokenInfo(tx.TxTo, (err, tokenInfo) => {
          if (err) {
            reject(err)
          } else {
            if (tokenInfo && oInputData.callCode) {
              let sourceCode = tokenInfo.sourceCode
              let tokenName = self._checkSecSubContract(tokenInfo.tokenName)
              let contractResult = self._runContract(oInputData.callCode, sourceCode)
              switch (contractResult.functionType) {
                case 'transfer':
                  self.contractForTransfer(tx, contractResult, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      tokenTx.TokenName = tokenName
                      resolve([tx, tokenTx])
                    }
                  })
                  break
                case 'deposit':
                  self.contractForDeposit(tx, contractResult, tokenInfo, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      resolve([tx])
                    }
                  })
                  break
                case 'withdraw':
                  self.contractForWithdraw(tx, contractResult, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      tokenTx.TokenName = tokenName
                      resolve([tx, tokenTx])
                    }
                  })
                  break
                case 'lock':
                  self.contractForLock(tx, contractResult, tokenInfo, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      resolve([tx])
                    }
                  })
                  break
                case 'releaseLock':
                  self.contractForReleaseLock(tx, contractResult, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      if (tokenTx) {
                        tokenTx.TokenName = tokenName
                        resolve([tx, tokenTx])
                      } else {
                        resolve([tx])
                      }
                    }
                  })
                  break
                default:
                  resolve()
              }
            } else if ((!tokenInfo) && oInputData.tokenName && oInputData.sourceCode && oInputData.totalSupply) {
              tokenInfo = {
                "tokenName": oInputData.tokenName,
                "sourceCode": oInputData.sourceCode,
                "totalSupply": oInputData.totalSupply,
                "timeLock": {},
                "approve": {},
                "creator": tx.TxFrom
              }
              self.contractForCreate(tx, tokenInfo, (err, tokenTx) => {
                if (err) {
                  reject(err)
                } else {
                  tx.TokenName = self._checkSecSubContract(oInputData.tokenName)
                  if (tokenTx) {
                    tokenTx.TokenName = self._checkSecSubContract(oInputData.tokenName)
                    resolve([tx, tokenTx])
                  } else {
                    resolve([tx])
                  }
                }
              })
            } else {
              reject(new Error('Invalid Smart Contract Call'))
            }
          }
        })
      } else {
        tx.TokenName = self.chainName
        resolve([tx])
      }
    })
  }

  _revertSmartContractDBWithTx(tx) {
    let self = this
    let oInputData
    return new Promise(function (resolve, reject) {
      if (SECUtils.isContractAddr(tx.TxTo)) {
        self.getTokenInfo(tx.TxTo, (err, tokenInfo) => {
          if (err) {
            reject(err)
          } else {
            try {
              oInputData = JSON.parse(tx.InputData)
            } catch (e) {
              reject(new Error('Invalid Smart Contract Call'))
            }
            if (oInputData.tokenName && oInputData.sourceCode && oInputData.totalSupply) {
              tokenInfo = {
                "tokenName": oInputData.tokenName,
                "sourceCode": oInputData.sourceCode,
                "totalSupply": oInputData.totalSupply,
                "timeLock": {},
                "approve": {},
                "creator": tx.TxFrom,
              }
              self.deleteTokenMap(tx.TxTo, (err) => {
                if (err) {
                  reject(err)
                } else {
                  self.revertContractForCreate(tx, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.tokenName = self._checkSecSubContract(oInputData.tokenName)
                      if (tokenTx) {
                        tokenTx.tokenName = self._checkSecSubContract(oInputData.tokenName)
                        resolve([tx, tokenTx])
                      } else {
                        resolve([tx])
                      }
                    }
                  })
                }
              })
            } else if (oInputData.callCode) {
              let sourceCode = tokenInfo.sourceCode
              let tokenName = self._checkSecSubContract(tokenInfo.tokenName)
              let contractResult = self._runContract(oInputData.callCode, sourceCode)
              switch (contractResult.functionType) {
                case 'transfer':
                  self.revertContractForTransfer(tx, contractResult, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      return callback(err)
                    } else {
                      tx.TokenName = tokenName
                      tokenTx.TokenName = tokenName
                      resolve([tx, tokenTx])
                    }
                  })
                  break
                case 'deposit':
                  self.revertContractForDeposit(tx, contractResult, tokenInfo, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      resolve([tx])
                    }
                  })
                  break
                case 'withdraw':
                  self.revertContractForWithdraw(tx, contractResult, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      tokenTx.TokenName = tokenName
                      resolve([tx, tokenTx])
                    }
                  })
                  break
                case 'lock':
                  self.revertContractForLock(tx, contractResult, tokenInfo, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      resolve([tx])
                    }
                  })
                  break
                case 'releaseLock':
                  self.revertContractForReleaseLock(tx, contractResult, tokenInfo, (err, tokenTx) => {
                    if (err) {
                      reject(err)
                    } else {
                      tx.TokenName = tokenName
                      tokenTx.TokenName = tokenName
                      resolve([tx, tokenTx])
                    }
                  })
                  break
                default:
                  resolve()
              }
            } else {
              reject(new Error('Invalid Smart Contract Call'))
            }
          }
        })
      } else {
        tx.TokenName = this.chainName
        resolve([tx])
      }
    })
  }

  contractForTransfer(tx, contractResult, tokenInfo, callback) {
    this.getNonce(tx.TxTo, (err, nonce) => {
      if (err) {
        callback(err, null)
      } else {
        let tokenTx = {
          Version: '0.1',
          TxReceiptStatus: 'success',
          TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
          TxFrom: tx.TxTo,
          TxTo: contractResult.Results.Address,
          Value: contractResult.Results.Amount.toString(),
          GasLimit: '0',
          GasUsedByTxn: '0',
          GasPrice: '0',
          TxFee: '0',
          Nonce: nonce,
          InputData: `Smart Contract Transaction`
        }
        let txHashBuffer = [
          Buffer.from(tokenTx.Version),
          SECUtils.intToBuffer(tokenTx.TimeStamp),
          Buffer.from(tokenTx.TxFrom, 'hex'),
          Buffer.from(tokenTx.TxTo, 'hex'),
          Buffer.from(tokenTx.Value),
          Buffer.from(tokenTx.GasLimit),
          Buffer.from(tokenTx.GasUsedByTxn),
          Buffer.from(tokenTx.GasPrice),
          Buffer.from(tokenTx.TxFee),
          Buffer.from(tokenTx.Nonce),
          Buffer.from(tokenTx.InputData)
        ]

        tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')
        callback(null, tokenTx)
      }
    })
  }

  contractForDeposit(tx, contractResult, tokenInfo, callback) {
    let approve = tokenInfo.approve
    let walletAddress = tx.TxFrom
    if (walletAddress in approve) {
      let balance = approve[walletAddress]
      balance = new Big(balance)
      balance = balance.plus(contractResult.Results.Amount)
      balance = balance.toFixed(DEC_NUM)
      tokenInfo.approve[walletAddress] = balance.toString()
    } else {
      tokenInfo.approve[walletAddress] = contractResult.Results.Amount.toString()
    }
    this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
      if (err) {
        return callback(err)
      } else {
        return callback(null)
      }
    })
  }

  contractForWithdraw(tx, contractResult, tokenInfo, callback) {
    let approve = tokenInfo.approve
    let walletAddress = tx.TxFrom
    if (walletAddress in approve) {
      let balance = approve[walletAddress]
      balance = new Big(balance)
      if (balance.gte(contractResult.Results.Amount)) {
        this.getNonce(tx.TxTo, (err, nonce) => {
          if (err) {
            return callback(err, null)
          } else {
            let tokenTx = {
              Version: '0.1',
              TxReceiptStatus: 'success',
              TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
              TxFrom: tx.TxTo,
              TxTo: contractResult.Results.Address,
              Value: contractResult.Results.Amount.toString(),
              GasLimit: '0',
              GasUsedByTxn: '0',
              GasPrice: '0',
              TxFee: '0',
              Nonce: nonce,
              InputData: `Smart Contract Transaction`
            }
            let txHashBuffer = [
              Buffer.from(tokenTx.Version),
              SECUtils.intToBuffer(tokenTx.TimeStamp),
              Buffer.from(tokenTx.TxFrom, 'hex'),
              Buffer.from(tokenTx.TxTo, 'hex'),
              Buffer.from(tokenTx.Value),
              Buffer.from(tokenTx.GasLimit),
              Buffer.from(tokenTx.GasUsedByTxn),
              Buffer.from(tokenTx.GasPrice),
              Buffer.from(tokenTx.TxFee),
              Buffer.from(tokenTx.Nonce),
              Buffer.from(tokenTx.InputData)
            ]

            tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')

            balance = balance.minus(contractResult.Results.Amount)
            balance = balance.toFixed(DEC_NUM)
            tokenInfo.approve[walletAddress] = balance
            this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
              if (err) {
                callback(err, null)
              } else {
                callback(null, tokenTx)
              }
            })
          }
        })
      } else {
        callback(new Error('Deposit is not enough'), null)
      }
    } else {
      callback(new Error('No Available Deposit Before'), null)
    }
  }

  contractForCreate(tx, tokenInfo, callback) {
    let totalSupply = tokenInfo.totalSupply
    this.getNonce(tx.TxTo, (err, nonce) => {
      if (err) {
        callback(err, null)
      } else {
        let tokenTx = null
        if (tokenInfo.tokenName !== this.chainName) {
          tokenTx = {
            Version: '0.1',
            TxReceiptStatus: 'success',
            TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
            TxFrom: '0000000000000000000000000000000000000000',
            TxTo: tx.TxFrom,
            Value: totalSupply.toString(),
            GasLimit: '0',
            GasUsedByTxn: '0',
            GasPrice: '0',
            TxFee: '0',
            Nonce: nonce,
            InputData: `Smart Contract Initialization`
          }

          let txHashBuffer = [
            Buffer.from(tokenTx.Version),
            SECUtils.intToBuffer(tokenTx.TimeStamp),
            Buffer.from(tokenTx.TxFrom, 'hex'),
            Buffer.from(tokenTx.TxTo, 'hex'),
            Buffer.from(tokenTx.Value),
            Buffer.from(tokenTx.GasLimit),
            Buffer.from(tokenTx.GasUsedByTxn),
            Buffer.from(tokenTx.GasPrice),
            Buffer.from(tokenTx.TxFee),
            Buffer.from(tokenTx.Nonce),
            Buffer.from(tokenTx.InputData)
          ]

          tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')
        }
        this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
          if (err) {
            callback(err, null)
          } else {
            callback(null, tokenTx)
          }
        })
      }
    })
  }

  contractForLock(tx, contractResult, tokenInfo, callback) {
    let timeLock = tokenInfo.timeLock
    let senderAddress = tx.TxFrom
    let benefitAddress = contractResult.Results.Address
    if (senderAddress in timeLock) {
      if (benefitAddress in timeLock[senderAddress]) {
        let sameUnlockTime = false
        for(let lockLog of timeLock[senderAddress][benefitAddress]){
          if(contractResult.Results.Time == lockLog.unlockTime){
            let balance = lockLog.lockAmount
            balance = new Big(balance)
            balance = balance.plus(contractResult.Results.Amount)
            balance = balance.toFixed(DEC_NUM)
            lockLog.lockAmount = balance.toString()
            sameUnlockTime = true
            break;
          }
        }
        if(!sameUnlockTime){
          timeLock[senderAddress][benefitAddress].push({
            lockTime: tx.TimeStamp,
            lockAmount: contractResult.Results.Amount.toString(),
            unlockTime: contractResult.Results.Time            
          })
        }
      } else {
        timeLock[senderAddress][benefitAddress] = 
          [{
            lockTime: tx.TimeStamp,
            lockAmount: contractResult.Results.Amount.toString(),
            unlockTime: contractResult.Results.Time
          }]
      }
    } else {
      timeLock[senderAddress] = {
        [benefitAddress]: 
          [{
            lockTime: tx.TimeStamp,
            lockAmount: contractResult.Results.Amount.toString(),
            unlockTime: contractResult.Results.Time
          }]        
      }
    }
    this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
      if (err) {
        return callback(err)
      } else {
        return callback(null)
      }
    })
  }

  contractForReleaseLock(tx, contractResult, tokenInfo, callback) {
    let timeLock = tokenInfo.timeLock
    let timeStamp = tx.TimeStamp
    let senderAddress = tx.TxFrom
    let benefitAddress = contractResult.Results.Address
    let amountToRelease = new Big(contractResult.Results.Amount)
    if (senderAddress in timeLock) {
      if (benefitAddress in timeLock[senderAddress]) {
        let benefitTimeLock = timeLock[senderAddress][benefitAddress]
        benefitTimeLock = benefitTimeLock.sort((a, b) => {
          return a.unlockTime - b.unlockTime
        })
        for (let i=0;i<benefitTimeLock.length;i++) {
          let lockLog = benefitTimeLock[i]
          if (lockLog.unlockTime <= timeStamp) {
            let lockedAmount = new Big(lockLog.lockAmount)
            if (!amountToRelease.isZero() && amountToRelease.gte(lockedAmount)) {
              amountToRelease = amountToRelease.minus(lockedAmount)
              benefitTimeLock.splice(i,1)
              i--
            } else {
              lockedAmount = lockedAmount.minus(amountToRelease)
              lockedAmount = lockedAmount.toFixed(DEC_NUM)
              lockLog.lockAmount = lockedAmount.toString
              amountToRelease = new Big(0)
              break
            }
          } else {
            continue
          }
        }
        if (amountToRelease > 0) {
          console.log(new Error('No enough unlocked Token'))
          //return callback(new Error('No enough unlocked Token'), null)
          return callback(null, null)
        } else {
          this.getNonce(tx.TxTo, (err, nonce) => {
            if (err) {
              return callback(err, null)
            } else {
              let tokenTx = {
                Version: '0.1',
                TxReceiptStatus: 'success',
                TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
                TxFrom: tx.TxTo,
                TxTo: contractResult.Results.Address,
                Value: contractResult.Results.Amount.toString(),
                GasLimit: '0',
                GasUsedByTxn: '0',
                GasPrice: '0',
                TxFee: '0',
                Nonce: nonce,
                InputData: `Smart Contract Transaction`
              }
              let txHashBuffer = [
                Buffer.from(tokenTx.Version),
                SECUtils.intToBuffer(tokenTx.TimeStamp),
                Buffer.from(tokenTx.TxFrom, 'hex'),
                Buffer.from(tokenTx.TxTo, 'hex'),
                Buffer.from(tokenTx.Value),
                Buffer.from(tokenTx.GasLimit),
                Buffer.from(tokenTx.GasUsedByTxn),
                Buffer.from(tokenTx.GasPrice),
                Buffer.from(tokenTx.TxFee),
                Buffer.from(tokenTx.Nonce),
                Buffer.from(tokenTx.InputData)
              ]

              tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')

              this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
                if (err) {
                  return callback(err, null)
                } else {
                  return callback(null, tokenTx)
                }
              })
            }
          })
        }
      } else {
        return callback(new Error(`Lock Log of Benefiter ${benefitAddress} From sender ${senderAddress} not Found`), null)
      }
    } else {
      return callback(new Error(`Lock Log of Sender ${senderAddress} not Found`), null)
    }
  }

  revertContractForTransfer(tx, contractResult, callback) {
    this.getNonce(tx.TxTo, (err, nonce) => {
      if (err) {
        callback(err, null)
      } else {
        this.getNonce(tx.TxTo, (err, nonce) => {
          if (err) {
            return callback(err, null)
          } else {
            let tokenTx = {
              Version: '0.1',
              TxReceiptStatus: 'success',
              TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
              TxFrom: tx.TxTo,
              TxTo: contractResult.Results.Address,
              Value: contractResult.Results.Amount.toString(),
              GasLimit: '0',
              GasUsedByTxn: '0',
              GasPrice: '0',
              TxFee: '0',
              Nonce: nonce,
              InputData: `Smart Contract Transaction`
            }
            let txHashBuffer = [
              Buffer.from(tokenTx.Version),
              SECUtils.intToBuffer(tokenTx.TimeStamp),
              Buffer.from(tokenTx.TxFrom, 'hex'),
              Buffer.from(tokenTx.TxTo, 'hex'),
              Buffer.from(tokenTx.Value),
              Buffer.from(tokenTx.GasLimit),
              Buffer.from(tokenTx.GasUsedByTxn),
              Buffer.from(tokenTx.GasPrice),
              Buffer.from(tokenTx.TxFee),
              Buffer.from(tokenTx.Nonce),
              Buffer.from(tokenTx.InputData)
            ]

            tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')
            callback(null, tokenTx)
          }
        })
      }
    })
  }

  revertContractForDeposit(tx, contractResult, tokenInfo, callback) {
    let approve = tokenInfo.approve
    let walletAddress = tx.TxFrom
    if (walletAddress in approve) {
      let balance = approve[walletAddress]
      balance = new Big(balance)
      balance = balance.minus(contractResult.Results.Amount)
      balance = balance.toFixed(DEC_NUM)
      tokenInfo.approve[walletAddress] = balance.toString()
    } else {
      tokenInfo.approve[walletAddress] = contractResult.Results.Amount.toString()
    }
    this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
      if (err) {
        return callback(err)
      }
    })
  }

  revertContractForWithdraw(tx, contractResult, tokenInfo, callback) {
    let approve = tokenInfo.approve
    let walletAddress = tx.TxFrom
    if (walletAddress in approve) {
      let balance = approve[walletAddress]
      balance = new Big(balance)
      balance = balance.plus(contractResult.Results.Amount)
      balance = balance.toFixed(DEC_NUM)
      tokenInfo.approve[walletAddress] = balance
      if (balance.gte(contractResult.Results.Amount)) {
        this.getNonce(tx.TxTo, (err, nonce) => {
          if (err) {
            return callback(err, null)
          } else {
            let tokenTx = {
              Version: '0.1',
              TxReceiptStatus: 'success',
              TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
              TxFrom: tx.TxTo,
              TxTo: contractResult.Results.Address,
              Value: contractResult.Results.Amount.toString(),
              GasLimit: '0',
              GasUsedByTxn: '0',
              GasPrice: '0',
              TxFee: '0',
              Nonce: nonce,
              InputData: `Smart Contract Transaction`
            }
            let txHashBuffer = [
              Buffer.from(tokenTx.Version),
              SECUtils.intToBuffer(tokenTx.TimeStamp),
              Buffer.from(tokenTx.TxFrom, 'hex'),
              Buffer.from(tokenTx.TxTo, 'hex'),
              Buffer.from(tokenTx.Value),
              Buffer.from(tokenTx.GasLimit),
              Buffer.from(tokenTx.GasUsedByTxn),
              Buffer.from(tokenTx.GasPrice),
              Buffer.from(tokenTx.TxFee),
              Buffer.from(tokenTx.Nonce),
              Buffer.from(tokenTx.InputData)
            ]

            tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')

            this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
              if (err) {
                callback(err, null)
              } else {
                callback(null, tokenTx)
              }
            })
          }

        })
      } else {
        callback(new Error('Deposit is not enough'), null)
      }
    } else {
      callback(new Error('No Available Deposit Before'), null)
    }
  }

  revertContractForCreate(tx, tokenInfo, callback) {
    let totalSupply = tokenInfo.totalSupply
    this.getNonce(tx.TxTo, (err, nonce) => {
      if (err) {
        callback(err, null)
      } else {
        let tokenTx = null
        if (tokenInfo.tokenName !== this.chainName) {
          tokenTx = {
            Version: '0.1',
            TxReceiptStatus: 'success',
            TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
            TxFrom: '0000000000000000000000000000000000000000',
            TxTo: tx.TxFrom,
            Value: totalSupply.toString(),
            GasLimit: '0',
            GasUsedByTxn: '0',
            GasPrice: '0',
            TxFee: '0',
            Nonce: nonce,
            InputData: `Smart Contract Initialization`
          }

          let txHashBuffer = [
            Buffer.from(tokenTx.Version),
            SECUtils.intToBuffer(tokenTx.TimeStamp),
            Buffer.from(tokenTx.TxFrom, 'hex'),
            Buffer.from(tokenTx.TxTo, 'hex'),
            Buffer.from(tokenTx.Value),
            Buffer.from(tokenTx.GasLimit),
            Buffer.from(tokenTx.GasUsedByTxn),
            Buffer.from(tokenTx.GasPrice),
            Buffer.from(tokenTx.TxFee),
            Buffer.from(tokenTx.Nonce),
            Buffer.from(tokenTx.InputData)
          ]

          tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')
        }
        callback(null, tokenTx)
      }
    })
  }

  revertContractForLock(tx, contractResult, tokenInfo, callback) {
    let timeLock = tokenInfo.timeLock
    let senderAddress = tx.TxFrom
    let benefitAddress = contractResult.Results.Address
    if (senderAddress in timeLock) {
      if (benefitAddress in timeLock[senderAddress]) {
        let sameUnlockTime = false
        for(let i=0; i<timeLock[senderAddress][benefitAddress].length; i++){
          let lockLog = timeLock[senderAddress][benefitAddress][i]
          if(contractResult.Results.Time == lockLog.lockTime){
            let balance = lockLog.lockAmount
            balance = new Big(balance)
            balance = balance.minus(contractResult.Results.Amount)
            balance = balance.toFixed(DEC_NUM)
            if (balance.isZero()) {
              timeLock[senderAddress][benefitAddress].splice(i, 1)
            } else {
              lockLog.lockAmount = balance.toString()
            }
            sameUnlockTime = true
            break            
          }
        }
        if(!sameUnlockTime){
          return callback(new Error('No Log to revert'))
        } else {
          this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
            if (err) {
              return callback(err)
            } else {
              return callback(null)
            }
          })
        }
      } else {
        return callback(new Error('No Log to revert'))
      }
    } else {
      return callback(new Error('No Log to revert'))
    }
  }

  revertContractForReleaseLock(tx, contractResult, tokenInfo, callback) {
    let timeLock = tokenInfo.timeLock
    let timeStamp = tx.TimeStamp
    let senderAddress = tx.TxFrom
    let benefitAddress = contractResult.Results.Address
    let amountToRelease = new Big(contractResult.Results.Amount)
    if (senderAddress in timeLock) {
      if (benefitAddress in timeLock[senderAddress]) {
        let benefitTimeLock = timeLock[senderAddress][benefitAddress]
        benefitTimeLock = benefitTimeLock.filter(ts => ts <= timeStamp).sort((a, b) => {
          return a.unlockTime - b.unlockTime
        })
        if (benefitTimeLock.length > 0) {
          let lockLog = benefitTimeLock[0]
          let lockedAmount = new Big(lockLog.lockAmount)
          lockedAmount = lockedAmount.plus(amountToRelease)
          lockedAmount = lockedAmount.toFixed(DEC_NUM)
          lockLog.lockAmount = lockedAmount.toString()
        } else {
          benefitTimeLock = [{
            lockTime: timeStamp,
            lockAmount: amountToRelease.toString(),
            unlockTime: timeStamp
          }]
        }
        this.getNonce(tx.TxTo, (err, nonce) => {
          if (err) {
            return callback(err, null)
          } else {
            let tokenTx = {
              Version: '0.1',
              TxReceiptStatus: 'success',
              TimeStamp: SECUtils.currentUnixTimeInMillisecond(),
              TxFrom: tx.TxTo,
              TxTo: contractResult.Results.Address,
              Value: contractResult.Results.Amount.toString(),
              GasLimit: '0',
              GasUsedByTxn: '0',
              GasPrice: '0',
              TxFee: '0',
              Nonce: nonce,
              InputData: `Smart Contract Transaction`
            }
            let txHashBuffer = [
              Buffer.from(tokenTx.Version),
              SECUtils.intToBuffer(tokenTx.TimeStamp),
              Buffer.from(tokenTx.TxFrom, 'hex'),
              Buffer.from(tokenTx.TxTo, 'hex'),
              Buffer.from(tokenTx.Value),
              Buffer.from(tokenTx.GasLimit),
              Buffer.from(tokenTx.GasUsedByTxn),
              Buffer.from(tokenTx.GasPrice),
              Buffer.from(tokenTx.TxFee),
              Buffer.from(tokenTx.Nonce),
              Buffer.from(tokenTx.InputData)
            ]

            tokenTx.TxHash = SECUtils.rlphash(txHashBuffer).toString('hex')

            this.addTokenMap(tokenInfo, tx.TxTo, (err) => {
              if (err) {
                return callback(err, null)
              } else {
                return callback(null, tokenTx)
              }
            })
          }
        })
      } else {
        return callback(new Error(`Lock Log of Benefiter ${benefitAddress} From sender ${senderAddress} not Found`), null)
      }
    } else {
      return callback(new Error(`Lock Log of Sender ${senderAddress} not Found`), null)
    }
  }

  _runContract(callCode, sourceCode) {
    let runScript = new Buffer(sourceCode, 'base64').toString() +
      '; Results = ' +
      new Buffer(callCode, 'base64').toString()
    let sandbox = {
      Results: {}
    }
    let response = {}
    try {
      vm.createContext(sandbox)
      vm.runInContext(runScript, sandbox)
      if (sandbox.Results.TransferFlag) {
        response.functionType = 'transfer'
      } else if (sandbox.Results.DepositFlag) {
        response.functionType = 'deposit'
      } else if (sandbox.Results.WithdrawFlag) {
        response.functionType = 'withdraw'
      } else if (sandbox.Results.LockFlag) {
        response.functionType = 'lock'
      } else if (sandbox.Results.ReleaseLockFlag) {
        response.functionType = 'releaseLock'
      } else {
        response.functionType = 'others'
      }
      response.Results = sandbox.Results
      return response
    } catch (err) {
      throw new Error(err)
    }
  }

  _typeCheck(variable) {
    if (typeof variable !== 'string') return false
    if (isNaN(parseInt(variable))) return false
    return true
  }

  async _asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  getNonce(userAddress, callback) {
    this.accTree.getNonce(userAddress, (err, nonce) => {
      if (err) callback(err, null)
      else {
        nonce = parseInt(nonce)
        let txArray = this.pool.getAllTxFromPool().filter(tx => (tx.TxFrom === userAddress || tx.TxTo === userAddress))
        nonce = nonce + txArray.length
        nonce = nonce.toString()
        callback(null, nonce)
      }
    })
  }

  _checkSecSubContract(tokenName){
    let regExp = /^SEC-[0-9a-zA-Z]{36}/
    let finalTokenName = tokenName;
    if(tokenName.match(regExp)){
      finalTokenName = 'SEC'
    }
    return finalTokenName;
  }
  // -------------------------  FUNCTIONS FOR SPECIAL PURPOSES  ------------------------
  // ---------------------------------  DON'T USE THEM  --------------------------------
  delBlock(height, callback) {
    if (height >= this.chainLength) {
      return callback(null)
    }
    // get block from db
    this.getBlock(height, (err, dbBlock) => {
      if (err) return callback(err, null)

      // update tx DB
      this.txDB.delBlock(dbBlock, (err) => {
        if (err) return callback(err)
        // update token chain DB
        this.chainDB.delBlock(dbBlock, (err) => {
          if (err) return callback(err)
          // update account tree DB
          this.revertSmartContractDB(dbBlock, (err, _dbblock) => {
            if (err) return callback(err)
            this.accTree.revertWithBlock(_dbblock, (err) => {
              if (err) return callback(err)
            })
            callback()
          })
        })
      })
    })
  }

  writeBlock(_block, callback) {
    // write a new block to DB
    let block = JSON.parse(JSON.stringify(_block))

    // parse block.Transactions
    block.Transactions.forEach((tx, index) => {
      if (typeof tx === 'string') {
        block.Transactions[index] = JSON.parse(tx)
        block.Transactions[index].BlockNumber = block.Number
        block.Transactions[index].BlockHash = block.Hash
      }
    })

    this.delBlock(block.Number, (err) => {
      if (err) return callback(err)
      this.txDB.writeBlock(block, (err) => {
        if (err) return callback(err)
        // update accTree BD
        let smartContractBlock = cloneDeep(block)
        this.updateSmartContractDB(smartContractBlock, (err, _smartContractBlock) => {
          if (err) return callback(err)
          // update token blockchain DB
          this.accTree.updateWithBlock(_smartContractBlock, (err) => {
            if (err) return callback(err)
            if (_smartContractBlock.Number != 0) {
              let newStateRoot = this.accTree.getRoot()
              _smartContractBlock.StateRoot = this.accTree.getRoot()
              block.StateRoot = newStateRoot
            }
            this.chainDB.writeTokenBlockToDB(cloneDeep(block), (err) => {
              if (err) return callback(err)
              this.chainLength = block.Number + 1
              callback(null, block.StateRoot)
            })
          })
        })
      })
    })
  }

  getTxForUser(addr, callback) {
    this.accTree.getAccInfo(addr, 'All', (err, info) => {
      if (err) return callback(err, null)
      else {
        let txList = []
        let txHashList = info[2]['From'].concat(info[2]['To'])
        let length = txHashList.length
        if (length === 0) {
          return callback(null, [])
        } else {
          let count = 0
          txHashList.forEach((txHash) => {
            this.txDB.getTx(txHash, (err, data) => {
              if (err) {
                return callback(err, null)
              } else {
                txList.push(data)
                count++
                if (count >= length) {
                  return callback(null, txList)
                }
              }
            })
          })
        }
      }
    })
  }

  // -------------------------  TEST FUNCTIONS  ------------------------
  getFromAccTree(accAddr, callback) {
    this.accTree.getAccInfo(accAddr, 'All', callback)
  }
}

module.exports = SECTokenBlockChain