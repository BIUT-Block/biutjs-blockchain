const SECDatahandler = require('@sec-block/secjs-datahandler')

class SECAccTree {
  /**
   * create a token chain block chain with config
   * @param {}
   *
   */
  constructor (config) {
    try {
      this.accTree = new SECDatahandler.AccTreeDB(config)
    } catch (e) {
      throw e
    }
  }

  clearDB (callback) {
    this.accTree.clearDB(callback)
  }

  checkRoot (callback) {
    this.accTree.checkRoot(callback)
  }

  getStateRoot () {
    return this.accTree.getRoot()
  }

  updateWithBlockChain (blockchain, callback) {
    this.accTree.updateWithBlockChain(blockchain).then(() => {
      callback()
    }).catch((err) => {
      callback(err)
    })
  }

  updateWithBlock (block, callback) {
    this.accTree.updateWithBlock(block).then(() => {
      callback()
    }).catch((err) => {
      callback(err)
    })
  }

  revertWithBlock (block, callback) {
    this.accTree.revertBlock(block).then(() => {
      callback()
    }).catch((err) => {
      callback(err)
    })
  }
}

module.exports = SECAccTree
