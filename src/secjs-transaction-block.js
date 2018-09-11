const SECTX = require('@sec-block/secjs-tx')
const SECUtil = require('@sec-block/secjs-util')
const SECHash = require('./secjs-hash.js')

class SECTransactionBlock {
  /**
    * create a transaction chain block with config
    * @param {*} config
    *
    */
  constructor (config) {
    this.config = config
    this.transactions = []
    this.blockModelHandler = new SECTX({
      type: 'transactionchain-block'
    }).getInstance()
    this.block = this.blockModelHandler.getModel()

    let hashalgo = 'sha256'
    this.secHash = new SECHash(hashalgo)
    this.util = new SECUtil()
  }

  getBlock () {
    return this.block
  }

  /**
    * generate a transaction chain block
    * @param {*} txPool, txBlockChain
    *
    */
  generateBlock (txPool, txBlockChain) {
    this.collectTxFromPool(txPool)
    this.fillInBlockInfo(txBlockChain)
  }

  /**
    * collect transactions from transaction pool
    * @param {*} txPool
    *
    */
  collectTxFromPool (txPool) {
    let txBuffer = txPool.getAllTxFromPool()
    txBuffer.forEach((currTx) => {
      let tx = JSON.parse(currTx)
      if (this.verifyTransaction(tx)) {
        this.transactions.push(tx)
      }
      // TODO: must write in future
      // else{
      // }
    })
  }

  calculateBlockHash () {
    return this.secHash.hash(JSON.stringify(this.block))
  }

  /**
    * assign value to block header
    * @param {*} txBlockChain
    *
    */
  fillInBlockInfo (txBlockChain) {
    this.block.Number = parseInt(txBlockChain.getCurrentHeight()) + 1 // txBlockChain.currentHeight + 1
    this.block.TransactionsRoot = this.config.TransactionsRoot
    this.block.ReceiptRoot = this.config.ReceiptRoot
    this.block.TimeStamp = this.util.currentUnixTimeSecond()
    this.block.Transactions = this.transactions
    this.block.ParentHash = this.config.ParentHash
    this.block.Beneficiary = this.config.userAddr
    this.block.ExtraData = this.config.ExtraData

    this.block.Nonce = this.config.Nonce // powCal.getNonce(this.block)
    this.block.Hash = this.calculateBlockHash()
  }

  /**
    * verify that the transaction is legal
    * @param {*} transaction
    *
    */
  verifyTransaction (transaction) {
    // do nothing, will be implemented in the future
    return true
  }
}

module.exports = SECTransactionBlock
