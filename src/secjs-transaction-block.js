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
    this.block.Height = txBlockChain.currentHeight // txBlockChain.currentHeight + 1
    this.block.TimeStamp = this.util.currentUnixtime()
    this.block.Transactions = this.transactions
    this.block.Parent_Hash = txBlockChain.lastBlockHash // randomGen.randomGenerate('string', 32)
    this.block.Mined_By = this.config.userAddr // randomGen.randomGenerate('string', 32)
    this.block.Extra_Data = this.config.Extra_Data // Empty?

    this.block.Size = JSON.stringify(this.block).length + 2 * this.secHash.getHashLength()
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
