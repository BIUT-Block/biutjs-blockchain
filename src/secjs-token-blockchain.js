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
    this.tokenBlockChain = {}
    this.config = config
    this.util = new SECUtil()
  }

  init (callback) {
    if (fs.existsSync(this.config.filePath)) {
      this.readBlockChainFile((data) => {
        this.tokenBlockChain = JSON.parse(data)
        callback(this.tokenBlockChain)
      })
    } else {
      let genesisBlock = this.generateGenesisBlock()
      this.addBlockToChain(genesisBlock)
      this.writeBlockChainToFile(() => {
        callback(this.tokenBlockChain)
      })
    }
  }

  getBlockChain () {
    return this.tokenBlockChain
  }

  readBlockChainFile (callback) {
    fs.readFile(this.config.filePath, (err, data) => {
      if (err) {
        throw new Error(`Token Blockchain can not be loaded `)
      } else {
        callback(data)
      }
    })
  }

  generateGenesisBlock () {
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

  /**
     * push a block at the bottom of the blockchain
     * @param {*} block
     *
     */
  addBlockToChain (block) {
    let blockHeight = this.getCurrentHeight()
    if (blockHeight === block.Height + 1) {
      this.tokenBlockChain[block.Height] = block
    } else {
      // TODO: must changed in future
      this.tokenBlockChain[parseInt(blockHeight) + 1] = block
    }
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
     * return last block's height
     * @param {*} None
     *
     */
  getCurrentHeight () {
    let blockHeight = 0
    Object.keys(this.tokenBlockChain).forEach(function (key) {
      if (key > parseInt(blockHeight)) {
        blockHeight = key
      }
    })
    return blockHeight
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
    let blockHeight = this.getCurrentHeight()
    return this.tokenBlockChain[blockHeight].Hash
  }

  /**
     * return last block's timestamp
     * @param {*} None
     *
     */
  getLastBlockTimeStamp () {
    let blockHeight = this.getCurrentHeight()
    return this.tokenBlockChain[blockHeight].TimeStamp
  }
}

module.exports = SECTokenBlockChain
