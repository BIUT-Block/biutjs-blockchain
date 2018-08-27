const SECTX = require('@sec-block/secjs-tx')
const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')

class SECTokenBlock {
  /**
    * create a token chain block with config
    * @param {*} config
    *
    */
  constructor (config) {
    this.tokenChainBlockHandler = new SECTX({
      type: 'tokenchain-block'
    }).getInstance()
    this.config = config
    this.transactions = []
    this.block = this.tokenChainBlockHandler.getModel()
    this.util = new SECUtil()
  }

  getBlock () {
    return this.block
  }

  /**
    * generate a token chain block
    * @param {*} tokenPool, tokenBlockChain
    *
    */
  generateBlock (tokenPool, tokenBlockChain) {
    this.collectTxFromPool(tokenPool)
    this.fillInBlockInfo(tokenBlockChain)
  }

  /**
    * collect transactions from transaction pool
    * @param {*} tokenPool
    *
    */
  collectTxFromPool (tokenPool) {
    let txBuffer = tokenPool.getAllTxFromPool()
    txBuffer.forEach((currTx) => {
      let tx = JSON.parse(currTx)
      if (this.verifyTransaction(tx)) {
        this.transactions.push(tx)
      } // else{
      // report???
      // }
    })
  }

  /**
    * assign value to block header
    * @param {*} tokenBlockChain
    *
    */
  fillInBlockInfo (tokenBlockChain) {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)

    this.block.Number = parseInt(tokenBlockChain.getCurrentHeight()) + 1
    this.block.TransactionsRoot = this.config.TransactionsRoot
    this.block.ReceiptRoot = this.config.ReceiptRoot
    this.block.LogsBloom = this.config.LogsBloom
    this.block.MixHash = this.config.MixHash
    this.block.StateRoot = this.config.StateRoot
    this.block.TimeStamp = this.util.currentUnixTimeSecond()
    this.block.Transactions = this.transactions
    this.block.ParentHash = this.config.ParentHash
    this.block.Beneficiary = this.config.userAddr
    this.block.Difficulty = this.config.Difficulty // randomGen.randomGenerate('number', 10000)
    this.block.GasUsed = this.config.GasUsed // randomGen.randomGenerate('number', 10000)
    this.block.GasLimit = this.config.GasLimit // randomGen.randomGenerate('number', 100000)
    this.block.ExtraData = this.config.ExtraData // Empty?
    this.block.Nonce = this.config.Nonce // powCal.getNonce(this.block)
    this.block.Hash = secjsHash.hash(JSON.stringify(this.block))
  }

  /**
    * verify that the transaction is legal
    * @param {*} transaction
    *
    */
  verifyTransaction (transaction) {
    // TODO: will be implemented in the future
    return true
  }
}

module.exports = SECTokenBlock
