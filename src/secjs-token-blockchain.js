const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')
const SECDataHandler = require('@sec-block/secjs-datahandler')
const dbconfig = {
  'DBPath': `${process.cwd()}/data/`
}

let secDataHandler = new SECDataHandler.TokenBlockChainDB(dbconfig)

class SECTokenBlockChain {
  /**
   * create a token chain block chain with config
   * @param {*} blockchain, config
   *
   */
  constructor () {
    this.tokenBlockChain = []
    this.util = new SECUtil()
  }

  /**
   * generate genesis block
   */
  _generateGenesisBlock () {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)
    let block = {
      'Number': 0,
      'TimeStamp': 1530297308,
      'Transactions': [],
      'Parent_Hash': 'Genesis',
      'Mined_By': 'SEC',
      'Difficulty': 1,
      'Total_Difficulty': 1,
      'Gas_Used': 0,
      'Gas_Limit': 0,
      'Block_Reward': 10,
      'Extra_Data': 'SEC Hello World',
      'Size': 334,
      'Nonce': '',
      'Hash': ''
    }
    block.Hash = secjsHash.hash(JSON.stringify(block))
    return block
  }

  /**
   * Initialize the class token-blockchain
   * @param {requestCallback} callback - The callback that handles the response.
   */
  init (callback) {
    secDataHandler.isTokenBlockChainDBEmpty((err, isEmpty) => {
      if (err) {
        throw new Error('Could not check db content')
      }
      if (isEmpty) {
        let genesisBlock = this._generateGenesisBlock()
        this.putGenesis(genesisBlock, callback)
      } else {
        this.getAllBlockChainFromDB(() => {
          callback(err)
        })
      }
    })
  }

  /**
   * put genesis into token block chain level database
   */
  putGenesis (genesis, callback) {
    this.tokenBlockChain.push(genesis)
    secDataHandler.writeTokenBlockToDB(genesis, (err) => {
      if (err) {
        throw new Error('Something wrong to write block into database')
      }
      callback()
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
   * get blockchain model
   */
  getBlockChain () {
    return this.tokenBlockChain
  }

  /**
   * get all blockchain data
   */
  getAllBlockChainFromDB (callback) {
    let blockchain = []
    secDataHandler.getTokenBlockChainDB((err, data) => {
      if (err) {
        throw new Error(`Can not get whole token block chain data from database`)
      }
      blockchain = data
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
  getBlockChainFromDB (minHeight, maxHeight, cb) {
    secDataHandler.getTokenChain(minHeight, maxHeight, cb)
  }

  /**
   * Put token block to db
   * @param {*} block the block object in json formation
   * @param {*} cb
   */
  putBlockToDB (block, cb) {
    secDataHandler.writeTokenBlockToDB(block, (err) => {
      if (err) {
        throw new Error('Something wrong with writeSingleTokenBlockToDB function')
      }
      cb()
    })
  }

  /**
   * Put token block to db
   * @param {*} block the block object in json formation
   * @param {*} callbback
   */
  putBlocksToDB (blocks, callback) {
    secDataHandler.writeTokenBlockToDB(blocks, (err) => {
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
