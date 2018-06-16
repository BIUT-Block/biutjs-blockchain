const fs = require('fs')

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
