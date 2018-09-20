const SECUtil = require('@sec-block/secjs-util')
const SECTransactionBlock = require('./secjs-transaction-block')

class SECTransactionBlockChain {
  /**
   * create a transaction chain block chain with config
   * @param {SECDataHandler} SECDataHandler
   */
  constructor (SECDataHandler) {
    if (!SECDataHandler) {
      throw new Error('Can not find SECDataHandler Instance')
    }
    this.SECDataHandler = SECDataHandler
    this.txBlockChain = []
    this.util = new SECUtil()
  }

  /**
   * generate genesis block
   */
  _generateGenesisBlock () {
    return new SECTransactionBlock({
      Number: 0,
      TransactionsRoot: this.util.SHA3_RLP.toString('hex'),
      ReceiptRoot: this.util.SHA3_RLP.toString('hex'),
      TimeStamp: 1537222077,
      ParentHash: this.util.zeros(32).toString('hex'),
      Beneficiary: this.util.SHA3_RLP.toString('hex'),
      ExtraData: 'SEC Hello World',
      Nonce: this.util.zeros(8).toString('hex'),
      Transactions: []
    }).getBlock()
  }

  /**
   * Initialize the class tx-blockchain
   * @param {callback} callback - The callback that handles the response.
   */
  init (callback) {
    this.SECDataHandler.isTxBlockChainDBEmpty((err, isEmpty) => {
      if (err) throw new Error('Could not check db content')
      if (isEmpty) {
        this.putBlockToDB(this._generateGenesisBlock(), callback)
      } else {
        this._getAllBlockChainFromDB(callback)
      }
    })
  }

  /**
   * put genesis into tx block chain level database
   * @param {SECTransactionBlock} block the block object in json formation
   * @param {callback} callback
   */
  putBlockToDB (block, callback) {
    if (block.Number === this.txBlockChain.length) {
      this.txBlockChain.push(JSON.parse(JSON.stringify(block)))
      this.SECDataHandler.writeTxBlockToDB(block, (err) => {
        if (err) throw new Error('Something wrong with writeTokenChainToDB function')
        callback()
      })
    } else {
      throw new Error('Can not add tx Block, tx Block Number is falsh.')
    }
  }

  /**
   * Put tx block to db
   * @param {*} block the block object in json formation
   * @param {*} callbback
   */
  putBlocksToDB (blocks, callback) {
    this.txBlockChain = this.txBlockChain.concat(blocks)
    this.SECDataHandler.writeTxBlockToDB(blocks, (err) => {
      if (err) throw new Error('Can not put tx blocks into database')
      callback()
    })
  }

  /**
   * get blockchain model
   */
  getBlockChain () {
    return this.txBlockChain
  }

  /**
   * get Transaction Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHashFromDB (hashArray, callback) {
    this.SECDataHandler.getTxBlockFromDB(hashArray, callback)
  }

  /**
   * get all blockchain data
   */
  _getAllBlockChainFromDB (callback) {
    this.SECDataHandler.getTxBlockChainDB((err, blockchain) => {
      if (err) throw new Error(`Can not get whole tx block chain data from database`)
      this.txBlockChain = blockchain
      callback()
    })
  }

  /**
   * get Token Chain from DB
   * @param {number} minHeight
   * @param {number} maxHeight
   * @param {function} callback
   */
  getBlockChainFromDB (minHeight, maxHeight, cb) {
    this.SECDataHandler.getTxChain(minHeight, maxHeight, cb)
  }

  /**
   * return last block's height
   */
  getCurrentHeight () {
    return this.txBlockChain.length - 1
  }

  /**
   * get genius block from buffer
   */
  getGenesisBlock () {
    if (typeof this.txBlockChain[0] === 'string') {
      this.txBlockChain[0] = JSON.parse(this.txBlockChain[0])
    }
    return this.txBlockChain[0]
  }

  /**
   * get the dificulty of blockchain
   */
  getGenesisBlockDifficulty () {
    if (typeof this.txBlockChain[0] === 'string') {
      this.txBlockChain[0] = JSON.parse(this.txBlockChain[0])
    }
    return this.txBlockChain[0].Difficulty
  }

  /**
   * get the genesis block hash
   */
  getGenesisBlockHash () {
    if (typeof this.txBlockChain[0] === 'string') {
      this.txBlockChain[0] = JSON.parse(this.txBlockChain[0])
    }
    return this.txBlockChain[0].Hash
  }

  /**
   * get last block
   */
  getLastBlock () {
    if (typeof this.txBlockChain[this.getCurrentHeight()] === 'string') {
      this.txBlockChain[this.getCurrentHeight()] = JSON.parse(this.txBlockChain[this.getCurrentHeight()])
    }
    return this.txBlockChain[this.getCurrentHeight()]
  }

  /**
   * return last block's hash value
   */
  getLastBlockHash () {
    if (typeof this.txBlockChain[this.getCurrentHeight()] === 'string') {
      this.txBlockChain[this.getCurrentHeight()] = JSON.parse(this.txBlockChain[this.getCurrentHeight()])
    }
    return this.txBlockChain[this.getCurrentHeight()].Hash
  }

  /**
   * return last block's timestamp
   * @param {*} None
   *
   */
  getLastBlockTimeStamp () {
    if (typeof this.txBlockChain[this.getCurrentHeight()] === 'string') {
      this.txBlockChain[this.getCurrentHeight()] = JSON.parse(this.txBlockChain[this.getCurrentHeight()])
    }
    return this.txBlockChain[this.getCurrentHeight()].TimeStamp
  }

  /**
   * get the dificulty of blockchain
   */
  getLastBlockDifficulty () {
    if (typeof this.txBlockChain[this.getCurrentHeight()] === 'string') {
      this.txBlockChain[this.getCurrentHeight()] = JSON.parse(this.txBlockChain[this.getCurrentHeight()])
    }
    return this.txBlockChain[this.getCurrentHeight()].Difficulty
  }

  getHashList () {
    let hashList = []
    this.txBlockChain.forEach(block => {
      hashList.push({
        Number: block.Number,
        Hash: block.Hash
      })
    })
    return hashList
  }
}

module.exports = SECTransactionBlockChain
