const SECUtil = require('@sec-block/secjs-util')
const SECTokenBlock = require('./secjs-token-block')

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
    this.util = new SECUtil()
  }

  /**
   * generate genesis token block
   */
  _generateGenesisBlock () {
    return new SECTokenBlock({
      Number: 0,
      TransactionsRoot: this.util.SHA3_RLP.toString('hex'),
      ReceiptRoot: this.util.SHA3_RLP.toString('hex'),
      LogsBloom: this.util.zeros(256).toString('hex'),
      MixHash: this.util.zeros(32).toString('hex'),
      StateRoot: this.util.SHA3_RLP.toString('hex'),
      TimeStamp: 1537222077,
      ParentHash: this.util.zeros(32).toString('hex'),
      Beneficiary: this.util.SHA3_RLP.toString('hex'),
      Difficulty: 1,
      GasUsed: 0,
      GasLimit: 100000,
      ExtraData: 'SEC Hello World',
      Nonce: this.util.zeros(8).toString('hex'),
      Transactions: []
    }).getBlock()
  }

  /**
   * Initialize the class token-blockchain
   * @param {callback} callback - The callback that handles the response.
   */
  init (callback) {
    this.SECDataHandler.isTokenBlockChainDBEmpty((err, isEmpty) => {
      if (err) throw new Error('Could not check db content')
      if (isEmpty) {
        this.putBlockToDB(this._generateGenesisBlock(), callback)
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
      if (err) throw new Error('Can not get whole token block chain data from database')
      this.tokenBlockChain = blockchain
      callback()
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
}

module.exports = SECTokenBlockChain
