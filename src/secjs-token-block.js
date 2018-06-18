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

    this.block.Height = tokenBlockChain.currentHeight + 1
    this.block.TimeStamp = this.util.currentUnixtime()
    this.block.Transactions = this.transactions
    this.block.Parent_Hash = tokenBlockChain.lastBlockHash
    this.block.Mined_By = this.config.userAddr
    this.block.Difficulty = this.config.Difficulty // randomGen.randomGenerate('number', 10000)
    this.block.Total_Difficulty = this.config.Total_Difficulty // randomGen.randomGenerate('number', 100000)
    this.block.Gas_Used = this.config.Gas_Used // randomGen.randomGenerate('number', 10000)
    this.block.Gas_Limit = this.config.Gas_Limit // randomGen.randomGenerate('number', 100000)
    this.block.Block_Reward = this.config.Block_Reward // 10 // TBD
    this.block.Extra_Data = this.config.Extra_Data // Empty?

    this.block.Size = JSON.stringify(this.block).length + 2 * secjsHash.getHashLength()
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
