const SECUtil = require('@sec-block/secjs-util')
const SECTokenBlock = require('./secjs-token-block')
const crypto = require('crypto')
const _ = require('lodash')

class SECTokenBlockChain {
  /**
   * create a token chain block chain with config
   * @param {SECDataHandler} SECDataHandler
   *
   */
  constructor (SECDataHandler) {
    if (!SECDataHandler) {
      throw new Error('Can not find SECDataHandler Instance')
    }
    this.SECDataHandler = SECDataHandler
    this.tokenBlockChain = []
  }

  /**
   * generate genesis token block
   */
  _generateTokenTransaction (SmartContractByteCode) {

    let keys = SECUtil.generateSecKeys()
    let privKey = keys.privKey
    let secAddress = keys.secAddress

    let TX_VERSION = '0.1'
    let TOKEN_VERSION = '0.1'

    let tokenTx = {
      Version: TOKEN_VERSION,
      TxReceiptStatus: `pending`,
      TimeStamp: SECUtil.currentUnixTimeInMillisecond(),
      TxFrom: secAddress,
      TxTo: crypto.randomBytes(20).toString('hex'),
      Value: '0',
      GasLimit: '0',
      GasUsedByTxn: '0',
      GasPrice: '0',
      Nonce: _.random(1, 1000).toString(),
      InputData: smartContractByteCode
    }

    let tokenTxBuffer = [
      Buffer.from(TX_VERSION),
      SECUtil.intToBuffer(tokenTx.TimeStamp),
      Buffer.from(tokenTx.TxFrom, 'hex'),
      Buffer.from(tokenTx.TxTo, 'hex'),
      SECUtil.intToBuffer(tokenTx.Value),
      Buffer.from(tokenTx.GasLimit),
      Buffer.from(tokenTx.GasUsedByTxn),
      Buffer.from(tokenTx.GasPrice),
      Buffer.from(tokenTx.Nonce, 'hex'),
      Buffer.from(tokenTx.InputData)
    ]

    let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
    tokenTx.Signature = SECUtil.ecsign(txSigHash, Buffer.from(privKey, 'hex'))
    tokenTx.TxFee = (tokenTx.GasPrice * tokenTx.GasUsedByTxn)

    tokenTxBuffer.push(Buffer.from(JSON.stringify(tokenTx.Signature)))
    tokenTx.TxHash = SECUtil.rlphash(tokenTxBuffer).toString('hex')

    return tokenTx
  }

  _generateGenesisBlock (smartContractByteCode = '') {
    return new SECTokenBlock({
      Number: 0,
      TransactionsRoot: SECUtil.KECCAK256_RLP.toString('hex'),
      ReceiptRoot: SECUtil.KECCAK256_RLP.toString('hex'),
      LogsBloom: SECUtil.zeros(256).toString('hex'),
      MixHash: SECUtil.zeros(32).toString('hex'),
      StateRoot: SECUtil.KECCAK256_RLP.toString('hex'),
      TimeStamp: 1537222077,
      ParentHash: SECUtil.zeros(32).toString('hex'),
      Beneficiary: SECUtil.zeros(20).toString('hex'),
      Difficulty: 1,
      GasUsed: 0,
      GasLimit: 100000,
      ExtraData: 'SEC Hello World',
      Nonce: SECUtil.zeros(8).toString('hex'),
      Transactions: [this._generateTokenTransaction(smartContractByteCode)]
    }).getBlock()
  }

  /**
   * Initialize the class token-blockchain
   * @param {callback} callback - The callback that handles the response.
   */
  init (SmartContractByteCode, callback) {
    this.SECDataHandler.isTokenBlockChainDBEmpty((err, isEmpty) => {
      if (err) throw new Error('Could not check db content')
      if (isEmpty) {
        this.putBlockToDB(this._generateGenesisBlock(smartContractByteCode), callback)
      } else {
        this._getAllBlockChainFromDB(callback)
      }
    })
  }

  /**
   * Put token block to db
   * @param {SECTokenBlock} block the block object in json formation
   * @param {callback} callback
   */
  putBlockToDB (block, callback) {
    if (block.Number === this.tokenBlockChain.length) {
      this.tokenBlockChain.push(JSON.parse(JSON.stringify(block)))
      this.SECDataHandler.writeTokenBlockToDB(block, (err) => {
        if (err) throw new Error('Something wrong with write Single TokenBlock To DB function')
        callback()
      })
    } else {
      throw new Error('Can not add token Block, token Block Number is falsh.')
    }
  }

  /**
   * Put token block to db
   * @param {Array} blocks the block object in json formation
   * @param {callback} callbback
   */
  putBlocksToDB (blocks, callback) {
    this.tokenBlockChain = this.tokenBlockChain.concat(blocks)
    this.SECDataHandler.writeTokenBlockToDB(blocks, (err) => {
      if (err) throw new Error('Can not put token blocks into database')
      callback()
    })
  }

  /**
   * get blockchain from cache
   */
  getBlockChain () {
    return this.tokenBlockChain
  }

  /**
   * get Token Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHash (hashArray, callback) {
    this.SECDataHandler.getTokenBlockFromDB(hashArray, callback)
  }

  /**
   * get all blockchain data
   */
  _getAllBlockChainFromDB (callback) {
    this.SECDataHandler.getTokenBlockChainDB((err, blockchain) => {
      if (err) {
        throw new Error('Can not get whole token block chain data from database')
      } else {
        let keyArray = []
        blockchain.forEach((block) => {
          keyArray.push(parseInt(block.Number, 10))
        })
        for (let i = 0; i < keyArray[keyArray.length - 1]; i++) {
          if (!(i in keyArray)) {
            blockchain.splice(i, 0, null)
          }
        }
        this.tokenBlockChain = blockchain
        callback()
      }
    })
  }

  /**
   * get Token Chain from DB
   * @param {number} minHeight
   * @param {number} maxHeight
   * @param {function} callback
   */
  getBlockChainFromDB (minHeight, maxHeight, callback) {
    this.SECDataHandler.getTokenChain(minHeight, maxHeight, callback)
  }

  /**
   * return last block's height
   */
  getCurrentHeight () {
    return this.tokenBlockChain.length - 1
  }

  /**
   * get genius block from buffer
   */
  getGenesisBlock () {
    if (typeof this.tokenBlockChain[0] === 'string') {
      this.tokenBlockChain[0] = JSON.parse(this.tokenBlockChain[0])
    }
    return this.tokenBlockChain[0]
  }

  /**
   * get the dificulty of blockchain
   */
  getGenesisBlockDifficulty () {
    if (typeof this.tokenBlockChain[0] === 'string') {
      this.tokenBlockChain[0] = JSON.parse(this.tokenBlockChain[0])
    }
    return this.tokenBlockChain[0].Difficulty
  }

  /**
   * get the genesis block hash
   */
  getGenesisBlockHash () {
    if (typeof this.tokenBlockChain[0] === 'string') {
      this.tokenBlockChain[0] = JSON.parse(this.tokenBlockChain[0])
    }
    return this.tokenBlockChain[0].Hash
  }

  /**
   * get the second last block from buffer
   */
  getSecondLastBlock () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight() - 1] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight() - 1] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight() - 1])
    }
    return this.tokenBlockChain[this.getCurrentHeight() - 1]
  }

  /**
   * get last block from buffer
   */
  getLastBlock () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()]
  }

  /**
   * return last block's hash value
   */
  getLastBlockHash () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()].Hash
  }

  /**
   * return last block's timestamp
   */
  getLastBlockTimeStamp () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()].TimeStamp
  }

  /**
   * get the dificulty of the last blockchain
   */
  getLastBlockDifficulty () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()].Difficulty
  }

  getHashList () {
    let hashList = []
    this.tokenBlockChain.forEach(block => {
      hashList.push({
        Number: block.Number,
        Hash: block.Hash
      })
    })
    return hashList
  }

  updateBlockchain (position, BlockArray, callback) {
    this.SECDataHandler.addUpdateBlock(position, BlockArray, (err) => {
      if (err) callback(err)
      this._getAllBlockChainFromDB(() => {
        callback()
      })
    })
  }
}

module.exports = SECTokenBlockChain
