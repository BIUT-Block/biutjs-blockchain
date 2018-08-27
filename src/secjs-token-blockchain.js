const SECUtil = require('@sec-block/secjs-util')
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
    let block = {
      'Number': 0,
      'TransactionsRoot': '',
      'ReceiptRoot': '',
      'LogsBloom': '',
      'MixHash': '',
      'StateRoot': '',
      'TimeStamp': 1530297308,
      'Transactions': [],
      'ParentHash': 'Genesis',
      'Beneficiary': 'SEC-Miner',
      'Difficulty': 1,
      'GasUsed': 0,
      'GasLimit': 0,
      'ExtraData': 'SEC Hello World',
      'Nonce': '',
      'Hash': '5f213ac06cfe4a82e167aa3ea430e520be99dcedb4ab47fd8f668448708e34c1'
    }
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
