const fs = require('fs')
const SECHash = require('./secjs-hash.js')

class SECTokenBlockChain {
  /**
     * create a token chain block chain with config
     * @param {*} blockchain, config
     *
     */
  constructor (blockchain, config) {
    this.tokenBlockChain = {}
    if ((typeof blockchain !== 'undefined') && (blockchain !== '')) {
      this.tokenBlockChain = JSON.parse(blockchain)
    }
    this.config = config
    this.currentBlockChain = ''
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
      this.writeBlockChainToFile(this.config.pathFile, () => {
        callback(this.tokenBlockChain)
      })
    }
  }

  readBlockChainFile (callback) {
    fs.readFile(this.config.filePath, (err, data) => {
      if (err) {
        throw new Error(`File can not be readed `)
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
      this.tokenBlockChain[blockHeight + 1] = block
    }
  }

  /**
     * store the blockchain to a local file
     * @param {*} file
     *
     */
  writeBlockChainToFile (file, callback) {
    fs.writeFile(file, JSON.stringify(this.tokenBlockChain), (err) => {
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
