const _ = require('lodash')
const async = require('async')
const Promise = require('promise')
const AccTreeDB = require('./secjs-accTree.js')
const SECUtils = require('@sec-block/secjs-util')
const SECTokenBlock = require('./secjs-token-block')
const SECDatahandler = require('@sec-block/secjs-datahandler')
const SECMerkleTree = require('@sec-block/secjs-merkle-tree')

class SECTokenBlockChain {
  /**
   * create a token chain block chain with config
   * @param {config} config
   *
   */

  constructor (config) {
    this.chainDB = new SECDatahandler.TokenBlockChainDB(config)
    this.txDB = new SECDatahandler.TokenTxDB(config)
    this.accTree = new AccTreeDB(config)
    this.smartContractTxDB = new SECDatahandler.SmartContractTxDB(config)
    this.chainLength = 0
  }

  /**
   * generate genesis token block
   */
  _generateGenesisBlock () {
    let extraData = 'SEC Hello World'
    if (process.env.secTest) {
      extraData = 'SEC Test Network Genesis Block'
    }
    return new SECTokenBlock({
      Number: 0,
      ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
      LogsBloom: SECUtils.zeros(256).toString('hex'),
      MixHash: SECUtils.zeros(32).toString('hex'),
      StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
      TimeStamp: 1537900000,
      ParentHash: SECUtils.zeros(32).toString('hex'),
      Beneficiary: SECUtils.zeros(20).toString('hex'),
      Difficulty: '1',
      ExtraData: extraData,
      Nonce: SECUtils.zeros(8).toString('hex'),
      Transactions: []
    }).getBlock()
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
            if (err) return callback(err)
            let root = block.StateRoot
            // check if the given root exists
            this.accTree.checkRoot(root, (err, result) => {
              // if it doesnt exist or error occurs:
              if (err || !result) {
                // clear DB
                this.accTree.clearDB((err) => {
                  if (err) return callback(err)
                  // update account tree db with whole token block chain
                  this.chainDB.getTokenBlockChainDB((err, chain) => {
                    if (err) return callback(err)

                    async.eachSeries(chain, (block, callback) => {
                      this.accTree.updateWithBlock(block, (err) => {
                        if (err) return callback(err)
                        callback()
                      })
                    }, (err) => {
                      return callback(err)
                    })
                  })
                })
              } else {
                // otherwise, create a new merkle tree which starts from the given root
                this.accTree.newTree(root)
                callback()
              }
            })
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
      }
    })

    if (!this.verifyTxRoot(block)) {
      return callback(new Error('Failed to verify transaction root'))
    }

    // verify parent hash
    this.verifyParentHash(block, (err, result) => {
      if (err) return callback(err)
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

            // update accTree BD
            this.setBlockTxTokenName(block, (err, _block) => {
              if (err) return callback(err)
              this.accTree.updateWithBlock(_block, (err) => { callback(err) })
            })
          })
        })
      } else {
        callback(new Error(`Can not add token Block, token Block Number is false, block.Number: ${block.Number}, this.chainLength: ${this.chainLength}`))
      }
    })
  }

  delBlockFromHeight (height, callback) {
    let indexArray = []
    let overwrittenTxArray = []
    let localHeight = this.getCurrentHeight()
    for (let i = height; i <= localHeight; i++) {
      indexArray.push(i)
    }

    async.eachSeries(indexArray, (i, cb) => {
      // get block from db
      this.getBlock(i, (err, dbBlock) => {
        if (err) {
          let e = new Error(`Error occurs when try to get block, block number is ${i}`)
          return cb(e, null)
        }

        // update tx DB
        this.txDB.delBlock(dbBlock, (err) => {
          if (err) return cb(err)
          // update token chain DB
          this.chainDB.delBlock(dbBlock, (err) => {
            if (err) return cb(err)
            // update accTree BD
            this.setBlockTxTokenName(dbBlock, (err, _dbBlock) => {
              if (err) return cb(err)
              this.accTree.revertWithBlock(_dbBlock, (err) => {
                if (err) return cb(err)
                _dbBlock.Transactions.forEach((tx) => {
                  tx.TxReceiptStatus = 'pending'
                  if (tx.TxFrom !== '0000000000000000000000000000000000000000') {
                    overwrittenTxArray.push(tx)
                  }
                })
              })
              cb()
            })
          })
        })
      })
    }, (err) => {
      if (err) return callback(err, null)
      else {
        _.remove(overwrittenTxArray, (tx) => {
          this.txDB.isTxExist(tx.TxHash, (err, result) => {
            if (err) return callback(err, null)
            else {
              return result
            }
          })
        })
        this.chainLength = height
        callback(err, overwrittenTxArray)
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
        callback(err)
      } else {
        this.chainLength = blockchain.length
        callback()
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

  // -------------------------  SMART CONTRACT TX DB FUNCTIONS  ------------------------
  add (tokenName, contractAddress, callback) {
    this.smartContractTxDB.add(tokenName, contractAddress, callback)
  }

  getContractAddress (tokenName, callback) {
    this.smartContractTxDB.getContractAddress(tokenName, callback)
  }

  getTokenName (addr, callback) {
    if (this.isSmartContractAddress(addr)) {
      this.SECTokenChain.getTokenName(addr, (err, tokenName) => {
        if (err) return callback(new Error(`Token name of address ${addr} cannot be found in database`), null)
        callback(null, tokenName)
      })
    } else {
      callback(null, 'SEC')
    }
  }

  setTxTokenName (tx) {
    let self = this
    return new Promise(function (resolve, reject) {
      self.getTokenName(tx.TxTo, (err, tokenName) => {
        if (err) reject(err)
        else {
          tx = JSON.parse(tx)
          tx.TokenName = tokenName
          tx = JSON.stringify(tx)
          resolve(tx)
        }
      })
    })
  }

  setBlockTxTokenName (block, callback) {
    let promiseList = []
    block.Transactions.forEach((tx) => {
      promiseList.push(this.setTxTokenName(tx))
    })

    Promise.all(promiseList).then((transactionsList) => {
      block.Transactions = transactionsList
      callback(null, block)
    }).catch((err) => {
      callback(err, null)
    })
  }

  isSmartContractAddress (addr) {
    // TBD
    return false
  }

  // -------------------------  FUNCTIONS FOR SPECIAL PURPOSES  ------------------------
  // ---------------------------------  DON'T USE THEM  --------------------------------
  delBlock (height, callback) {
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
          this.setBlockTxTokenName(dbBlock, (err, _dbblock) => {
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

  writeBlock (_block, callback) {
    // write a new block to DB
    let block = JSON.parse(JSON.stringify(_block))

    // parse block.Transactions
    block.Transactions.forEach((tx, index) => {
      if (typeof tx === 'string') {
        block.Transactions[index] = JSON.parse(tx)
      }
    })

    this.delBlock(block.Number, (err) => {
      if (err) return callback(err)
      this.txDB.writeBlock(block, (err) => {
        if (err) return callback(err)
        // update token blockchain DB
        this.chainDB.writeTokenBlockToDB(block, (err) => {
          if (err) return callback(err)
          // update accTree BD
          this.setBlockTxTokenName(block, (err, _block) => {
            if (err) return callback(err)
            this.accTree.updateWithBlock(_block, (err) => { callback(err) })
          })
        })
      })
    })
  }
}

module.exports = SECTokenBlockChain
