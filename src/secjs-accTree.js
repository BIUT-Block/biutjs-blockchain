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

  getStateRoot () {
    return this.accTree.getRoot()
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
