const SECUtil = require('@sec-block/secjs-util')

class SECTransactionBlockChain {
  /**
   * create a transaction chain block chain with config
   * @param {*} blockchain, config
   */
  constructor (secDataHandler) {
    this.secDataHandler = secDataHandler
    this.txBlockChain = []
    this.util = new SECUtil()
  }

  /**
   * generate genesis block
   */
  _generateGenesisBlock () {
    let block = {}
    block.Number = 0 // txBlockChain.currentHeight + 1
    block.TransactionsRoot = ''
    block.ReceiptRoot = ''
    block.TimeStamp = 1530297308
    block.ParentHash = 'Genesis'
    block.ExtraData = 'SEC Hello World'
    block.Nonce = '' // powCal.getNonce(this.block)
    block.Beneficiary = 'SEC-Miner'
    block.Hash = '04c7123071429bbfcfb6ffd22501bdcc575f8df820041d63d8c16b94a9696ecf'
    block.Transactions = []
    return block
  }

  /**
   * Initialize the class token-blockchain
   * @param {requestCallback} callback - The callback that handles the response.
   */
  init (callback) {
    this.secDataHandler.isTxBlockChainDBEmpty((err, isEmpty) => {
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
    this.txBlockChain.push(genesis)
    this.secDataHandler.writeTxBlockToDB(genesis, (err) => {
      if (err) {
        throw new Error('Something wrong with writeTokenChainToDB function')
      }
      callback()
    })
  }

  /**
   * get Transaction Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHashFromDB (hashArray, callback) {
    this.secDataHandler.getTxBlockFromDB(hashArray, callback)
  }

  /**
   * get blockchain model
   */
  getBlockChain () {
    return this.txBlockChain
  }

  /**
   * get all blockchain data
   */
  getAllBlockChainFromDB (callback) {
    let blockchain = []
    this.secDataHandler.getTxBlockChainDB((err, data) => {
      if (err) {
        throw new Error(`Can not get whole token block chain data from database`)
      }
      blockchain = data
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
    this.secDataHandler.getTxChain(minHeight, maxHeight, cb)
  }

  /**
    * Put transaction block to db
    * @param {*} block the block object in json formation
    * @param {*} cb
  */
  putBlockToDB (block, callback) {
    this.txBlockChain.push(block)
    this.secDataHandler.writeTxBlockToDB(block, (err) => {
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
    this.txBlockChain = this.txBlockChain.concat(blocks)
    this.secDataHandler.writeTxBlockToDB(blocks, (err) => {
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
    if (typeof this.txBlockChain[0] === 'string') {
      this.txBlockChain[0] = JSON.parse(this.txBlockChain[0])
    }
    return this.txBlockChain[0].Difficulty
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
   * @param {*} None
   *
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
}

module.exports = SECTransactionBlockChain
