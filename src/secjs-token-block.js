const SECTX = require('@sec-block/secjs-tx')
const SECUtil = require('@sec-block/secjs-util')

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
    this.block = this.tokenChainBlockHandler.getModel()
    this.blockHeader = {}
    this.blockHeaderBuffer = []
    this.blockBody = []
    this.blockBodyBuffer = []
    this.util = new SECUtil()
    this.hasHeader = false
    this.hasBody = false
  }

  getBlock () {
    return this.block
  }

  setBlock (block) {
    this.block = block
    this.blockHeader = block
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockHeaderBuffer()
    this._generateBlockBodyBuffer()
  }

  setBlockHeader (block) {
    for (let key in block) {
      this.block[key] = block[key]
    }
    this.blockHeader = block
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockHeaderBuffer()
  }

  setBlockHeaderFromBuffer (blockHeaderBuffer) {
    this.blockBodyBuffer = this.blockBodyBuffer
    this.block.Number = this.util.bufferToInt(blockHeaderBuffer[0])
    this.block.TransactionsRoot = blockHeaderBuffer[1].toString('hex')
    this.block.ReceiptRoot = blockHeaderBuffer[2].toString('hex')
    this.block.LogsBloom = blockHeaderBuffer[3].toString('hex')
    this.block.MixHash = blockHeaderBuffer[4].toString('hex')
    this.block.StateRoot = blockHeaderBuffer[5].toString('hex')
    this.block.TimeStamp = this.util.bufferToInt(blockHeaderBuffer[6])
    this.block.ParentHash = blockHeaderBuffer[7].toString('hex')
    this.block.Difficulty = this.util.bufferToInt(blockHeaderBuffer[8])
    this.block.GasUsed = this.util.bufferToInt(blockHeaderBuffer[9])
    this.block.GasLimit = this.util.bufferToInt(blockHeaderBuffer[10])
    this.block.ExtraData = blockHeaderBuffer[11].toString('hex')
    this.block.Nonce = blockHeaderBuffer[12].toString('hex')
  }

  getBlockHeader () {
    return this.blockHeader
  }

  getBlockHeaderBuffer () {
    return this.blockHeaderBuffer
  }

  getBlockHeaderHash () {
    return this.util.rlphash(this.blockBodyBuffer)
  }

  setBlockBody (body) {
    this.blockBody = body
    this.block.Transactions = this.blockBody
    this._generateBlockBodyBuffer()
  }

  setBlockBodyBuffer (bodyBuffer) {
    this.blockBodyBuffer = bodyBuffer
  }

  getBlockBody () {
    return this.blockBody
  }

  getBlockBodyBuffer () {
    return this.blockBodyBuffer
  }

  getBlockBodyHash () {
    return this.util.rlphash(this.blockBodyBuffer)
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
    let txCache = tokenPool.getAllTxFromPool()
    txCache.forEach((currTx) => {
      let tx = JSON.parse(currTx)
      if (this.verifyTransaction(tx)) {
        this.blockBody.push(tx)
      }
    })
  }

  /**
    * assign value to block header
    * @param {*} tokenBlockChain
    *
    */
  fillInBlockInfo (tokenBlockChain) {
    // Header
    this.blockHeader.Number = parseInt(tokenBlockChain.getCurrentHeight()) + 1
    this.blockHeader.TransactionsRoot = this.config.TransactionsRoot
    this.blockHeader.ReceiptRoot = this.config.ReceiptRoot
    this.blockHeader.LogsBloom = this.config.LogsBloom
    this.blockHeader.MixHash = this.config.MixHash
    this.blockHeader.StateRoot = this.config.StateRoot
    this.blockHeader.TimeStamp = this.util.currentUnixTimeSecond()
    this.blockHeader.ParentHash = this.config.ParentHash
    this.blockHeader.Difficulty = this.config.Difficulty
    this.blockHeader.GasUsed = this.config.GasUsed
    this.blockHeader.GasLimit = this.config.GasLimit
    this.blockHeader.ExtraData = this.config.ExtraData
    this.blockHeader.Nonce = this.config.Nonce

    this.block = this.blockHeader
    this.block.Beneficiary = this.config.userAddr
    this.block.Hash = this.util.rlphash(this.blockHeaderBuffer)

    this._generateBlockHeaderBuffer()

    // Body
    this.block.Transactions = this.blockBody
    this._generateBlockBodyBuffer()
  }

  hasHeader () {
    return this.hasHeader
  }

  hasBody () {
    return this.hasBody
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

  _generateBlockHeaderBuffer () {
    this.blockHeaderBuffer = [
      this.util.intToBuffer(this.blockHeader.Number),
      Buffer.from(this.blockHeader.TransactionsRoot, 'hex'),
      Buffer.from(this.blockHeader.ReceiptRoot, 'hex'),
      Buffer.from(this.blockHeader.LogsBloom, 'hex'),
      Buffer.from(this.blockHeader.MixHash, 'hex'),
      Buffer.from(this.blockHeader.StateRoot, 'hex'),
      this.util.intToBuffer(this.blockHeader.TimeStamp),
      Buffer.from(this.blockHeader.ParentHash),
      this.util.intToBuffer(this.blockHeader.Difficulty),
      this.util.intToBuffer(this.blockHeader.GasUsed),
      this.util.intToBuffer(this.blockHeader.GasLimit),
      Buffer.from(this.blockHeader.ExtraData, 'hex'),
      Buffer.from(this.blockHeader.Nonce, 'hex')
    ]
  }

  _generateBlockBodyBuffer () {
    this.blockBody.forEach(tx => {
      this.blockBodyBuffer.push(Buffer.from(JSON.stringify(tx), 'hex'))
    })
  }
}

module.exports = SECTokenBlock
