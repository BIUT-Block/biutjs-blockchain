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
    this.DB = new SECDatahandler.TokenBlockChainDB(config)
    this.chainLength = 0
    this.tokenTx = {}
  }

  _updateTokenTxBuffer (block) {
    if (typeof block === 'string') {
      block = JSON.parse(block)
    }

    block = JSON.parse(JSON.stringify(block))
    block.Transactions.forEach((tx) => {
      if (typeof tx === 'string') {
        tx = JSON.parse(tx)
      }
      this.tokenTx[tx.TxHash] = [tx.TxFrom, tx.TxTo, parseFloat(tx.Value), parseFloat(tx.TxFee)]
    })
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
    this.DB.isTokenBlockChainDBEmpty((err, isEmpty) => {
      if (err) throw new Error('Could not check db content')
      if (isEmpty) {
        this.putBlockToDB(this._generateGenesisBlock(), callback)
      } else {
        this._getAllBlockChainFromDB(callback)
      }
    })
  }

  verifyParentHash (block, callback) {
    if (block.Number !== 0) {
      this.getBlock(block.Number - 1, (err, block) => {
        if (err) callback(err)
        else {
          if (block.ParentHash !== block.Hash) {
            let err = new Error(`Invalid Parent Hash: ${block.ParentHash}, which should be ${block.Hash}`)
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

    this.verifyParentHash((err) => {
      if (err) callback(err, null)
      else {
        if (block.Number === this.chainLength) {
          this._updateTokenTxBuffer(block)
          this.DB.writeTokenBlockToDB(block, (err) => {
            if (err) throw new Error('Something wrong with write Single TokenBlock To DB function')
            else {
              this.chainLength++
              callback()
            }
          })
        } else if (block.Number < this.chainLength) {
          this.getBlock(block.Number, (err, dbBlock) => {
            if (err) callback(err, null)
            else {
              // overwrite forked blocks
              if (block.Hash !== dbBlock.Hash) {
                let overwrittenTxArray = []
                dbBlock.Transactions.forEach((tx) => {
                  delete this.tokenTx[tx.TxHash]
                  tx.TxReceiptStatus = 'pending'
                  if (tx.TxFrom !== '0000000000000000000000000000000000000000') {
                    overwrittenTxArray.push(tx)
                  }
                })

                this._updateTokenTxBuffer(block)
                this.DB.writeTokenBlockToDB(block, (err) => {
                  if (err) throw new Error('Something wrong with write Single TokenBlock To DB function')

                  _.remove(overwrittenTxArray, (tx) => {
                    return tx.TxHash in this.tokenTx
                  })
                  callback(overwrittenTxArray)
                })
              }
            }
          })
        } else {
          throw new Error('Can not add token Block, token Block Number is false.')
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
    this.DB.getTokenBlockFromDB(hashArray, callback)
  }

  /**
   * get all blockchain data
   */
  _getAllBlockChainFromDB (callback) {
    this.DB.getTokenBlockChainDB((err, blockchain) => {
      if (err) {
        throw new Error('Can not get whole token block chain data from database')
      } else {
        this.chainLength = blockchain.length
        blockchain.forEach((block) => {
          this._updateTokenTxBuffer(block)
        })
        callback()
      }
    })
  }

  /**
   * return last block's height
   */
  getCurrentHeight () {
    return this.chainLength
  }

  getBlocksFromDB (minHeight, maxHeight = this.getCurrentHeight(), callback) {
    this.DB.getTokenChain(minHeight, maxHeight, callback)
  }

  getBlock (num, callback) {
    this.DB.getBlock(num, (err, block) => {
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
    this.getBlock(this.chainLength, callback)
  }

  /**
   * get the second last block
   */
  getSecondLastBlock (callback) {
    this.getBlock(this.chainLength - 1, callback)
  }

  getHashList (callback) {
    this.DB.getHashList(callback)
  }
}

module.exports = SECTokenBlockChain
