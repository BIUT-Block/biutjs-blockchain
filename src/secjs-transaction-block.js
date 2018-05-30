const txBlockModel = require('../model/transactionchain-block-model')
// const powCal = require('pow-calculation')
const SECHash = require('./secjs-hash.js')
const randomGen = require('./secjs-random-generate')

class SECTransactionBlock {
  /**
     * create a transaction chain block with config
     * @param {*} config
     *
     */
  constructor (config) {
    this.config = config
    this.transactions = []
    this.block = txBlockModel
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
      } // else{
      // report???
      // }
    })
  }

  /**
     * assign value to block header
     * @param {*} txBlockChain
     *
     */
  fillInBlockInfo (txBlockChain) {
    let hashalgo = 'sha256'
    let secjsHash = new SECHash(hashalgo)

    this.block.Height = randomGen.randomGenerate('number', 10000) // txBlockChain.currentHeight + 1
    this.block.TimeStamp = new Date().getTime()
    this.block.Transactions = this.transactions
    this.block.Parent_Hash = randomGen.randomGenerate('string', 32) // txBlockChain.lastBlockHash
    this.block.Mined_By = randomGen.randomGenerate('string', 32) // this.config.userAddr
    this.block.Block_Reward = 10 // TBD
    this.block.Extra_Data = '' // Empty?

    this.block.Size = JSON.stringify(this.block).length + 2 * secjsHash.getHashLength()
    this.block.Hash = secjsHash.hash(JSON.stringify(this.block))
    this.block.Nonce = randomGen.randomGenerate('string', 32) // powCal.getNonce(this.block)
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
