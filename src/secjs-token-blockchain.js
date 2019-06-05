const async = require('async')
const AccTreeDB = require('./secjs-accTree.js')
const geneData = require('./genesisBlock.js')
const SECUtils = require('@biut-block/biutjs-util')
const SECTokenBlock = require('./secjs-token-block')
const SECDatahandler = require('@biut-block/biutjs-datahandler')
const SECMerkleTree = require('@biut-block/biutjs-merkle-tree')

class SECTokenBlockChain {
  /**
   * create a token chain block chain with config
   * @param {config} config
   *
   */

  constructor (config) {
    this.chainName = config.chainName
    this.chainDB = new SECDatahandler.TokenBlockChainDB(config.dbconfig)
    this.txDB = new SECDatahandler.TokenTxDB(config.dbconfig)
    this.accTree = new AccTreeDB(config.dbconfig)
    this.chainLength = 0
  }

  /**
   * generate genesis token block
   */
  _generateGenesisBlock () {
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
  init (callback) {
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
        // if tokenDB is not empty, then firstly get the state root of the last block
        this._getAllBlockChainFromDB(() => {
          this.getLastBlock((err, block) => {
            if (err) callback(err)
            else {
              let root = block.StateRoot
              root = root.substr(2) // remove 0x
              // check if the given root exists
              this.accTree.checkRoot(root, (err, result) => {
                // if it doesnt exist or error occurs:
                if (err || !result) {
                  // clear DB
                  this.accTree.clearDB((err) => {
                    if (err) callback(err)
                    else {
                      // update account tree db with whole token block chain
                      this.chainDB.getTokenBlockChainDB((err, chain) => {
                        if (err) {
                          callback(err)
                        } else {
                          this.accTree.updateWithBlockChain(chain, (err) => {
                            if (err) {
                              callback(err)
                            } else {
                              callback()
                            }
                          })
                        }
                      })
                    }
                  })
                } else {
                  // otherwise, create a new merkle tree which starts from the given root
                  this.accTree.newTree(root)
                  callback()
                }
              })
            }
          })
        })
      }
    })
  }

  verifyParentHash (block, callback) {
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

  verifyDifficulty (block, callback) {
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

  verifyTxRoot (block) {
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

  /**
   * Put token block to db
   * @param {SECTokenBlock} block the block object in json formation
   * @param {callback} callback
   */
  putBlockToDB (_block, callback) {
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
      // this.verifyDifficulty(block, (err) => {
        // if (err) return callback(err)
      if (!result) {
        // do nothing if failed to verify parent hash
        callback(new Error('Failed to verify parent hash'))
      } else if (block.Number === this.chainLength) {
        // new block received, update tokenTxDB
        this.txDB.writeBlock(block, (err) => {
          if (err) return callback(err)
          // update token blockchain DB
          this.chainDB.writeTokenBlockToDB(block, (err) => {
            if (err) return callback(err)
            this.chainLength = block.Number + 1
            this.accTree.updateWithBlock(block, (err) => { callback(err) })
          })
        })
      } else {
        callback(new Error(`Can not add token Block, token Block Number is false, block.Number: ${block.Number}, this.chainLength: ${this.chainLength}`))
      }
      // })
    })
  }

  delBlockFromHeight (height, callback) {
    let indexArray = []
    let revertTxArray = []
    let localHeight = this.getCurrentHeight()
    for (let i = height; i <= localHeight; i++) {
      indexArray.push(i)
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
      if (err) return callback(err, null)
      else {
        this.chainLength = height
        callback(err, revertTxArray)
      }
    })
  }

  /**
   * get Token Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHash (hashArray, callback) {
    this.chainDB.getTokenBlockFromDB(hashArray, callback)
  }

  /**
   * get all blockchain data
   */
  _getAllBlockChainFromDB (callback) {
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
  getCurrentHeight () {
    return this.chainLength - 1
  }

  getBlocksFromDB (minHeight, maxHeight = this.getCurrentHeight(), callback) {
    if (maxHeight > this.getCurrentHeight()) {
      maxHeight = this.getCurrentHeight()
    }
    this.chainDB.getTokenChain(minHeight, maxHeight, callback)
  }

  getBlock (num, callback) {
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
  getGenesisBlock (callback) {
    this.getBlock(0, callback)
  }

  /**
   * get last block
   */
  getLastBlock (callback) {
    this.getBlock(this.chainLength - 1, callback)
  }

  /**
   * get the second last block
   */
  getSecondLastBlock (callback) {
    if (this.chainLength <= 1) {
      let err = new Error('this.chainLength <= 1, failed to get second last block')
      return callback(err, null)
    }
    this.getBlock(this.chainLength - 2, callback)
  }

  getHashList (callback) {
    this.chainDB.getHashList(callback)
  }

  // -------------------------  FUNCTIONS FOR SPECIAL PURPOSES  ------------------------
  // ---------------------------------  DON'T USE THEM  --------------------------------
  delBlock (height, callback) {
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
          this.accTree.revertWithBlock(dbBlock, (err) => {
            if (err) return callback(err)
          })
          callback()
        })
      })
    })
  }

  writeBlock (_block, callback) {
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
        // update token blockchain DB
        this.chainDB.writeTokenBlockToDB(block, (err) => {
          if (err) return callback(err)
          this.accTree.updateWithBlock(block, (err) => {
            this.chainLength = block.Number + 1
            callback(err)
          })
        })
      })
    })
  }

  getTxForUser (addr, callback) {
    this.accTree.getAccInfo(addr, (err, info) => {
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
  getFromAccTree (accAddr, callback) {
    this.accTree.getAccInfo(accAddr, callback)
  }
}

module.exports = SECTokenBlockChain
