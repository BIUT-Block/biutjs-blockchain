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
    block.Height = 0
    block.TimeStamp = 1530297308
    block.Transactions = []
    block.Parent_Hash = 'Genesis'
    block.Mined_By = 'SEC'
    block.Difficulty = 1
    block.Total_Difficulty = 1
    block.Gas_Used = 0
    block.Gas_Limit = 0
    block.Block_Reward = 10
    block.Extra_Data = 'SEC Hello World'

    block.Size = JSON.stringify(block).length + 2 * secjsHash.getHashLength()
    block.Nonce = ''
    block.Hash = secjsHash.hash(JSON.stringify(block))
    return block
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
   * get blockchain model
   */
  getBlockChain () {
    return this.tokenBlockChain
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

  putBlockToDB (block, cb) {
    secDataHandler.writeTokenChainToDB(block, (err) => {
      if (err) {
        throw new Error('Something wrong with writeTokenChainToDB function')
      }
      cb()
    })
  }

  /**
   * get Block from db
   */
  getBlockFromDB (hash, cb) {
    secDataHandler.getAccountTx(hash, cb)
  }

  /**
   * get Blocks from db
   */
  getBlocksFromDB(hashArray, cb) {
    let blocks = []
    hashArray.foreach((hash) => {
      blocks.push(secDataHandler.getAccountTx(hash))
    })
    return blocks
  }



  /**
     * push a block at the bottom of the blockchain
     * @param {*} block
     *
     */
  addBlockToChain (block) {
    if (this.getCurrentHeight() < block.Height) {
      this.tokenBlockChain.push(block)
    } else {
      // TODO: must changed in future
    }
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
  getGenesis () {
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
  getLastBlock() {
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
