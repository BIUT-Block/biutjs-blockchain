const fs = require('fs')
const SECHash = require('./secjs-hash.js')

class SECTransactionBlockChain {
  /**
   * create a transaction chain block chain with config
   * @param {*} blockchain, config
   *
   */
  constructor (config = { filePath: process.cwd() + '/data/txchain.json' }) {
    this.txBlockChain = {}
    this.config = config
  }

  init (callback) {
    if (fs.existsSync(this.config.filePath)) {
      this.readBlockChainFile((data) => {
        this.txBlockChain = JSON.parse(data)
        callback(this.txBlockChain)
      })
    } else {
      this.generateGenesisBlock()
      this.writeBlockChainToFile(() => {
        callback(this.txBlockChain)
      })
    }
  }

  getBlockChain () {
    return this.txBlockChain
  }

  readBlockChainFile (callback) {
    fs.readFile(this.config.filePath, (err, data) => {
      if (err) {
        throw new Error(`Transaction Blockchain can not be loaded`)
      } else {
        callback(data)
      }
    })
  }

  generateGenesisBlock () {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)
    let block = {}
    block.Height = 0 // txBlockChain.currentHeight + 1
    block.TimeStamp = this.util.currentUnixtime()
    block.Transactions = []
    block.Parent_Hash = 'Genesis'
    block.Mined_By = 'SEC'
    block.Extra_Data = 'SEC Hello World'
    block.Size = JSON.stringify(block).length + 2 * secjsHash.getHashLength()
    block.Nonce = '' // powCal.getNonce(this.block)
    block.Hash = secjsHash.hash(JSON.stringify(block))
    return block
  }

  /**
   * push a block at the bottom of the blockchain
   * @param {*} block
   */
  addBlockToChain (block) {
    let blockHeight = this.getCurrentHeight()
    if (blockHeight === block.Height + 1) {
      this.txBlockChain[block.Height] = block
    } else {
      // TODO: must changed in future
      this.txBlockChain[blockHeight + 1] = block
    }
  }

  /**
   * store the blockchain to a local file
   * @param {*} file
   *
   */
  writeBlockChainToFile (callback) {
    fs.writeFile(this.config.filePath, JSON.stringify(this.txBlockChain), (err) => {
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
    Object.keys(this.txBlockChain).forEach(function (key) {
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
    return this.txBlockChain[blockHeight].Hash
  }

  /**
   * return last block's timestamp
   * @param {*} None
   *
   */
  getLastBlockTimeStamp () {
    let blockHeight = this.getCurrentHeight()
    return this.txBlockChain[blockHeight].TimeStamp
  }
}

module.exports = SECTransactionBlockChain
