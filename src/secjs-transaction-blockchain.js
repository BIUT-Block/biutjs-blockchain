const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')
const SECDataHandler = require('@sec-block/secjs-datahandler')
const dbconfig = {
  'DBPath': `${process.cwd()}/data/`
}

let secDataHandler = new SECDataHandler.TxBlockChainDB(dbconfig)

class SECTransactionBlockChain {
  /**
   * create a transaction chain block chain with config
   * @param {*} blockchain, config
   *
   */
  constructor (config = {}) {
    this.txBlockChain = []
    this.config = config
    this.util = new SECUtil()
  }

  /**
   * generate genesis block
   */
  _generateGenesisBlock () {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)
    let block = {}
    block.ParentHash = 'Genesis'
    block.TransactionsRoot = ''
    block.ReceiptRoot = ''
    block.Number = 0 // txBlockChain.currentHeight + 1
    block.TimeStamp = 1530297308
    block.ExtraData = 'SEC Hello World'
    block.Nonce = '' // powCal.getNonce(this.block)
    block.Beneficiary = 'SEC-Miner'
    block.Hash = secjsHash.hash(JSON.stringify(block))
    block.Transactions = []
    return block
  }

  /**
   * Initialize the class token-blockchain
   * @param {requestCallback} callback - The callback that handles the response.
   */
  init (callback) {
    secDataHandler.isTxBlockChainDBEmpty((err, isEmpty) => {
      if (err) {
        throw new Error('Could not check db content')
      }
      if (isEmpty) {
        let genesisBlock = this._generateGenesisBlock()
        this.putGenesis(genesisBlock, callback)
      } else {
        secDataHandler.getTxBlockChainDB((err, buffer) => {
          this.getAllBlockChainFromDB(() => {
            callback(err)
          })
        })
      }
    })
  }

  /**
   * get all blockchain data
   */
  getAllBlockChainFromDB (callback) {
    let blockchain = []
    secDataHandler.getTxBlockChainDB((err, data) => {
      if (err) {
        throw new Error(`Can not get whole token block chain data from database`)
      }
      blockchain = data
      this.txBlockChain = blockchain
      callback()
    })
  }

  /**
   * put genesis into token block chain level database
   */
  putGenesis (genesis, cb) {
    secDataHandler.writeTxBlockToDB(genesis, (err) => {
      if (err) {
        throw new Error('Something wrong with writeTokenChainToDB function')
      }
      cb()
    })
  }

  /**
   * get Transaction Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHashFromDB (hashArray, callback) {
    secDataHandler.getTxBlockFromDB(hashArray, callback)
  }

  /**
   * get blockchain model
   */
  getBlockChain () {
    return this.txBlockChain
  }

  /**
   * get Token Chain from DB
   * @param {number} minHeight
   * @param {number} maxHeight
   * @param {function} callback
   */
  getBlockChainFromDB (minHeight, maxHeight, cb) {
    secDataHandler.getTxChain(minHeight, maxHeight, cb)
  }

  /**
    * Put transaction block to db
    * @param {*} block the block object in json formation
    * @param {*} cb
  */
  putBlockToDB (block, callback) {
    secDataHandler.writeTxBlockToDB(block, (err) => {
      if (err) {
        throw new Error('Something wrong with writeTokenChainToDB function')
      }
      callback()
    })
  }

  /**
   * Put token block to db
   * @param {*} block the block object in json formation
   * @param {*} callbback
   */
  putBlocksToDB (blocks, callback) {
    secDataHandler.writeTxBlockToDB(blocks, (err) => {
      if (err) {
        throw new Error('Can not put token blocks into database')
      }
      callback()
    })
  }

  /**
   * return last block's height
   * @param {*} None
   *
   */
  getCurrentHeight () {
    return this.txBlockChain.length - 1
  }

  /**
   * get the dificulty of blockchain
   */
  getGenesisBlockDifficulty () {
    return this.txBlockChain[0].Difficulty
  }

  /**
   * get genius block from buffer
   */
  getGenesisBlock () {
    return this.txBlockChain[0]
  }

  /**
   * get the genesis block hash
   */
  getGenesisBlockHash () {
    return this.txBlockChain[0].Hash
  }

  /**
   * get last block
   */
  getLastBlock () {
    return this.txBlockChain[this.getCurrentHeight()]
  }

  /**
   * return last block's hash value
   * @param {*} None
   *
   */
  getLastBlockHash () {
    return this.txBlockChain[this.getCurrentHeight()].Hash
  }

  /**
   * return last block's timestamp
   * @param {*} None
   *
   */
  getLastBlockTimeStamp () {
    return this.txBlockChain[this.getCurrentHeight()].TimeStamp
  }
}

module.exports = SECTransactionBlockChain
