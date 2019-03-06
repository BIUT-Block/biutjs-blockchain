const _ = require('lodash')
const AccTreeDB = require('./secjs-accTree.js')
const SECUtils = require('@sec-block/secjs-util')
const SECTokenBlock = require('./secjs-token-block')
const SECDatahandler = require('@sec-block/secjs-datahandler')

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
      TimeStamp: 1537300000,
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
            if (err) callback(err)
            else {
              let root = block.StateRoot
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

    // verify parent hash
    this.verifyParentHash(block, (err, result) => {
      if (err) callback(err, null)
      else {
        if (!result) {
          // do nothing if failed to verify parent hash
        } else if (block.Number === this.chainLength) {
          // new block received, update tokenTxDB
          this.txDB.writeBlock(block, (err) => {
            if (err) callback(err, null)
            // update token blockchain DB
            else {
              this.chainDB.writeTokenBlockToDB(block, (err) => {
                if (err) callback(err, null)
                else {
                  this.chainLength++
                  this.accTree.updateWithBlock(block, (err) => { callback(err) })
                }
              })
            }
          })
        } else if (block.Number < this.chainLength) {
          // fork found or block already exists
          this.getBlock(block.Number, (err, dbBlock) => {
            if (err) callback(err, null)
            else {
              // overwrite forked blocks
              if (block.Hash !== dbBlock.Hash) {
                let overwrittenTxArray = []
                this.txDB.delBlock(dbBlock, (err) => {
                  if (err) callback(err)
                  else {
                    this.chainDB.delBlockHash(dbBlock.Hash, (err) => {
                      if (err) return callback(err)
                      this.accTree.revertWithBlock(dbBlock, (err) => {
                        if (err) callback(err)
                        else {
                          dbBlock.Transactions.forEach((tx) => {
                            tx.TxReceiptStatus = 'pending'
                            if (tx.TxFrom !== '0000000000000000000000000000000000000000') {
                              overwrittenTxArray.push(tx)
                            }
                          })

                          this.txDB.writeBlock(block, (err) => {
                            if (err) callback(err)
                            else {
                              this.chainDB.writeTokenBlockToDB(block, (err) => {
                                if (err) callback(err)
                                else {
                                  _.remove(overwrittenTxArray, (tx) => {
                                    this.txDB.isTxExist(tx.TxHash, (err, result) => {
                                      if (err) callback(err)
                                      else {
                                        return result
                                      }
                                    })
                                  })
                                  this.accTree.updateWithBlock(block, (err) => { callback(err, overwrittenTxArray) })
                                }
                              })
                            }
                          })
                        }
                      })
                    })
                  }
                })
              } else {
                callback()
              }
            }
          })
        } else {
          console.log(`block.Number: ${block.Number}`)
          console.log(`this.chainLength: ${this.chainLength}`)
          callback(new Error('Can not add token Block, token Block Number is false.'), null)
        }
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
}

module.exports = SECTokenBlockChain
