const _ = require('lodash')
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
      if (err) callback(new Error('Could not check db content'))
      else if (isEmpty) {
        this.putBlockToDB(this._generateGenesisBlock(), callback)
      } else {
        this._getAllBlockChainFromDB(callback)
      }
    })
  }

  verifyParentHash (block, callback) {
    if (block.Number !== 0) {
      this.getBlock(block.Number - 1, (err, lastblock) => {
        if (err) callback(err)
        else {
          if (block.ParentHash !== lastblock.Hash) {
            let err = new Error(`Invalid Parent Hash: ${block.ParentHash}, which should be ${lastblock.Hash}`)
            return callback(err)
          }
          callback(null)
        }
      })
    } else {
      callback(null)
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

    this.verifyParentHash(block, (err) => {
      if (err) callback(err, null)
      else {
        if (block.Number === this.chainLength) {
          // update tokenTxDB
          this.txDB.writeBlock(block, (err) => {
            if (err) callback(err, null)
            // update token blockchain DB
            this.chainDB.writeTokenBlockToDB(block, (err) => {
              if (err) callback(err, null)
              else {
                this.chainLength++
                callback()
              }
            })
          })
        } else if (block.Number < this.chainLength) {
          this.getBlock(block.Number, (err, dbBlock) => {
            if (err) callback(err, null)
            else {
              // overwrite forked blocks
              if (block.Hash !== dbBlock.Hash) {
                let overwrittenTxArray = []
                this.txDB.delBlock((err) => {
                  if (err) callback(err)
                  else {
                    dbBlock.Transactions.forEach((tx) => {
                      tx.TxReceiptStatus = 'pending'
                      if (tx.TxFrom !== '0000000000000000000000000000000000000000') {
                        overwrittenTxArray.push(tx)
                      }
                    })

                    this.txDB.writeBlock((err) => {
                      if (err) callback(err)
                      this.chainDB.writeTokenBlockToDB(block, (err) => {
                        if (err) callback(err)
                        else {
                          // _.remove(overwrittenTxArray, (tx) => {
                          //   return tx.TxHash in this.tokenTx
                          // })
                          callback(null, overwrittenTxArray)
                        }
                      })
                    })
                  }
                })
              }
            }
          })
        } else {
          callback(new Error('Can not add token Block, token Block Number is false.'), null)
        }
      }
    })
  }

  getTxBuffer () {
    return this.tokenTx
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
