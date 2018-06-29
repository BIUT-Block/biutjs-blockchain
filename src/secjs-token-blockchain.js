const fs = require('fs')
const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')

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

  _generateGenesisBlock () {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)
    let block = {}
    block.Height = 0
    block.TimeStamp = Math.round((new Date()).getTime() / 1000)
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

  _readBlockChainFile (callback) {
    fs.readFile(this.config.filePath, (err, data) => {
      if (err) {
        throw new Error(`Token Blockchain can not be loaded `)
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
  _writeBlockChainToFile (callback) {
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
      this._writeBlockChainToFile(() => {
        callback(this.tokenBlockChain)
      })
    }
  }

  getBlockChain () {
    return this.tokenBlockChain
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

  getGenesisBlockDifficulty () {
    return this.tokenBlockChain[0].Difficulty
  }

  getGenesisBlockHash () {
    return this.tokenBlockChain[0].Hash
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
