const fs = require('fs')
const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')
const SECDataHandler = require('@sec-block/secjs-datahandler')
const dbconfig = {
  'DBPath': '../data/'
}

let secDataHandler = new SECDataHandler(dbconfig)

class SECTokenBlockChain {
  /**
    * create a token chain block chain with config
    * @param {*} blockchain, config
    *
    */
  constructor (config = { filePath: process.cwd() + '/data/tokenchain.json' }) {
    this.tokenBlockChain = []
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
    block.ParentHash = 'Genesis' // verify in header
    block.TransactionsRoot = '' // verify in header
    block.ReceiptRoot = '' // verify in header
    block.LogsBloom = '' // verify in header
    block.Difficulty = 1 // verify in header
    block.Number = 0 // verify in header
    block.GasLimit = 0 // verify in header
    block.GasUsed = 0 // verify in header
    block.TimeStamp = 1533686400 // verify in header
    block.ExtraData = 'SEC Genesis' // verify in header
    block.MixHash = '' // verify in header
    block.Nonce = '' // verify in header
    block.Beneficiary = 'SEC-Miner'
    block.StateRoot = ''
    block.Hash = secjsHash.hash(JSON.stringify(block))
    block.Transactions = []
    return block
  }

  /**
   * Initialize the class token-blockchain
   * @param {requestCallback} callback - The callback that handles the response.
   */
  init (callback) {
    if (fs.existsSync(this.config.filePath)) {
      this._readBlockChainFile((data) => {
        this.tokenBlockChain = JSON.parse(data)
        callback(this.tokenBlockChain)
      })
    } else {
      let genesisBlock = this._generateGenesisBlock()
      this.addBlockToChain(genesisBlock)
      this.writeBlockChainToFile(() => {
        callback(this.tokenBlockChain)
      })
    }
  }

  /**
   * put genesis into token block chain level database
   */
  putGenesis (genesis, cb) {
    secDataHandler.writeTokenChainToDB(genesis, (err) => {
      if (err) {
        throw new Error('Something wrong with writeTokenChainToDB function')
      }
      cb()
    })
  }

  /**
   * get Token Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHashFromDB (hashArray, cb) {
    secDataHandler.getTokenBlockFromDB(hashArray, cb)
  }

  /**
   * get Token Chain from DB
   * @param {number} minHeight
   * @param {number} maxHeight
   * @param {function} callback
   */
  getBlocksFromDB (hashArray, cb) {
    let blocks = []
    hashArray.foreach((hash) => {
      blocks.push(secDataHandler.getAccountTx(hash))
    })
    return blocks
  }

  /**
   * read saved blockchain file
   * @param {function} callback
   */
  _readBlockChainFile (callback) {
    fs.readFile(this.config.filePath, (err, data) => {
      if (err) {
        throw new Error(`Token Blockchain can not be loaded`)
      } else {
        callback(data)
      }
    })
  }

  /**
   * store the blockchain to a local file
   * @param {*} file
   *
   */
  writeBlockChainToFile (callback) {
    fs.writeFile(this.config.filePath, JSON.stringify(this.tokenBlockChain), (err) => {
      if (err) throw err
      callback()
    })
  }

  /**
   * get blockchain model
   */
  getBlockChain () {
    return this.tokenBlockChain
  }

  /**
   * get Token Chain from DB
   * @param {number} minHeight
   * @param {number} maxHeight
   * @param {function} callback
   */
  getBlockChainFromDB (minHeight, maxHeight, cb) {
    secDataHandler.getTokenChain(minHeight, maxHeight, cb)
  }

  /**
   * push a block at the bottom of the blockchain
   * @param {*} block
   *
   */
  addBlockToChain (block) {
    if (this.getCurrentHeight() < block.Number) {
      this.tokenBlockChain.push(block)
    } else {
      // TODO: must changed in future
    }
  }

  /**
   * Put transaction block to db
   * @param {*} block the block object in json formation
   * @param {*} cb
   */
  putBlockToDB (block, cb) {
    secDataHandler.writeTokenChainToDB(block, (err) => {
      if (err) {
        throw new Error('Something wrong with writeTokenChainToDB function')
      }
      cb()
    })
  }

  /**
     * return last block's height
     * @param {*} None
     *
     */
  getCurrentHeight () {
    return this.tokenBlockChain.length - 1
  }

  /**
   * get the dificulty of blockchain
   */
  getGenesisBlockDifficulty () {
    return this.tokenBlockChain[0].Difficulty
  }

  /**
   * get genius block from buffer
   */
  getGenesisBlock () {
    return this.tokenBlockChain[0]
  }

  /**
   * get the genesis block hash
   */
  getGenesisBlockHash () {
    return this.tokenBlockChain[0].Hash
  }

  /**
   * get last block from buffer
   */
  getLastBlock () {
    return this.tokenBlockChain[this.getCurrentHeight()]
  }

  /**
     * return last block's hash value
     * @param {*} None
     *
     */
  getLastBlockHash () {
    return this.tokenBlockChain[this.getCurrentHeight()].Hash
  }

  /**
     * return last block's timestamp
     * @param {*} None
     *
     */
  getLastBlockTimeStamp () {
    return this.tokenBlockChain[this.getCurrentHeight()].TimeStamp
  }
}

module.exports = SECTokenBlockChain
