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

  newTree (root) {
    this.accTree.constructNewTree(root)
  }

  getAccInfo (accAddr, callback) {
    this.accTree.getAccInfo(accAddr, callback)
  }

  getBalance (accAddr, callback) {
    this.getAccInfo(accAddr, (err, info) => {
      if (err) callback(err, null)
      else {
        callback(null, parseFloat(info[0]))
      }
    })
  }

  getNonce (accAddr, callback) {
    this.getAccInfo(accAddr, (err, info) => {
      if (err) callback(err, null)
      else {
        callback(null, info[1])
      }
    })
  }

  clearDB (callback) {
    this.accTree.clearDB(callback)
  }

  checkRoot (root, callback) {
    this.accTree.checkRoot(root, callback)
  }

  getRoot () {
    return this.accTree.getRoot()
  }

  getRoots (callback) {
    this.accTree.getRoots(callback)
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
