const fs = require('fs')
const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')

class SECTransactionBlockChain {
  /**
   * create a transaction chain block chain with config
   * @param {*} blockchain, config
   *
   */
  constructor (config = { filePath: process.cwd() + '/data/txchain.json' }) {
    this.txBlockChain = []
    this.config = config
    this.util = new SECUtil()
  }

  _generateGenesisBlock () {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)
    let block = {}
    block.Height = 0 // txBlockChain.currentHeight + 1
    block.TimeStamp = 1530297308
    block.Transactions = []
    block.Parent_Hash = 'Genesis'
    block.Mined_By = 'SEC'
    block.Extra_Data = 'SEC Hello World'
    block.Size = JSON.stringify(block).length + 2 * secjsHash.getHashLength()
    block.Nonce = '' // powCal.getNonce(this.block)
    block.Hash = secjsHash.hash(JSON.stringify(block))
    return block
  }

  _readBlockChainFile (callback) {
    fs.readFile(this.config.filePath, (err, data) => {
      if (err) {
        throw new Error(`Transaction Blockchain can not be loaded`)
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
    fs.writeFile(this.config.filePath, JSON.stringify(this.txBlockChain), (err) => {
      if (err) throw err
      callback()
    })
  }

  init (callback) {
    if (fs.existsSync(this.config.filePath)) {
      this._readBlockChainFile((data) => {
        this.txBlockChain = JSON.parse(data)
        callback(this.txBlockChain)
      })
    } else {
      let genesisBlock = this._generateGenesisBlock()
      this.addBlockToChain(genesisBlock)
      this.writeBlockChainToFile(() => {
        callback(this.txBlockChain)
      })
    }
  }

  getBlockChain () {
    return this.txBlockChain
  }

  /**
   * push a block at the bottom of the blockchain
   * @param {*} block
   */
  addBlockToChain (block) {
    if (this.getCurrentHeight() < block.Height) {
      this.txBlockChain.push(block)
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
    return this.txBlockChain.length - 1
  }

  getGenesisBlockDifficulty () {
    return this.txBlockChain[0].Difficulty
  }

  getGenesisBlockHash () {
    return this.txBlockChain[0].Hash
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
