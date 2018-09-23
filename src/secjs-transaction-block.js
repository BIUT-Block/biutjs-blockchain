const SECUtil = require('@sec-block/secjs-util')
const SECTransactionBlockModel = require('../model/transactionchain-block-model')

class SECTransactionBlock {
  /**
    * create a transaction chain block with config
    * @param {*} config
    *
    */
  constructor (config = {}) {
    this.config = config
    this.block = SECTransactionBlockModel
    this.blockBuffer = []
    this.blockHeader = {}
    this.blockHeaderBuffer = []
    this.blockBody = []
    this.blockBodyBuffer = []
    this.util = new SECUtil()
    this.hasHeader = false
    this.hasBody = false
    if (Object.keys(config).length !== 0) {
      this._generateBlock()
    }
  }

  setBlockchain (transactionBlockchain) {
    this.transactionBlockchain = transactionBlockchain
  }

  getBlock () {
    return this.block
  }

  getBlockBuffer () {
    return this.blockBuffer
  }

  setBlock (block) {
    this.block = Object.assign({}, block)
    this.blockBody = block.Transactions
    this.blockHeader = Object.assign({}, block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockBuffer()
    this._generateBlockHeaderBuffer()
    this._generateBlockBodyBuffer()
    this.hasHeader = true
    this.hasBody = true
  }

  setBlockFromBuffer (blockBuffer) {
    this.blockBuffer = blockBuffer.slice(0)
    this.block.Number = this.util.bufferToInt(blockBuffer[0])
    this.block.TransactionsRoot = blockBuffer[1].toString('hex')
    this.block.ReceiptRoot = blockBuffer[2].toString('hex')
    this.block.TimeStamp = this.util.bufferToInt(blockBuffer[3])
    this.block.ParentHash = blockBuffer[4].toString('hex')
    this.block.ExtraData = blockBuffer[5].toString()
    this.block.Nonce = blockBuffer[6].toString('hex')
    this.blockHeader = Object.assign({}, this.block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockHeaderBuffer()
    this.hasHeader = true
    this.block.Hash = blockBuffer[7].toString('hex')
    this.block.Beneficiary = blockBuffer[8].toString()
    this.block.Transactions = JSON.parse(blockBuffer[9].toString())
    this.blockBody = this.block.Transactions.slice(0)
    this._generateBlockBodyBuffer()
    this.hasBody = true
  }

  setBlockHeader (block) {
    for (let key in block) {
      this.block[key] = block[key]
    }
    this.blockHeader = Object.assign({}, block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this._generateBlockHeaderBuffer()
    this.hasHeader = true
  }

  setBlockHeaderFromBuffer (blockHeaderBuffer) {
    this.blockHeaderBuffer = blockHeaderBuffer.slice(0)
    this.block.Number = this.util.bufferToInt(blockHeaderBuffer[0])
    this.block.TransactionsRoot = blockHeaderBuffer[1].toString('hex')
    this.block.ReceiptRoot = blockHeaderBuffer[2].toString('hex')
    this.block.TimeStamp = this.util.bufferToInt(blockHeaderBuffer[3])
    this.block.ParentHash = blockHeaderBuffer[4].toString('hex')
    this.block.ExtraData = blockHeaderBuffer[5].toString()
    this.block.Nonce = blockHeaderBuffer[6].toString('hex')
    this.blockHeader = Object.assign({}, this.block)
    delete this.blockHeader.Beneficiary
    delete this.blockHeader.Hash
    delete this.blockHeader.Transactions
    this.hasHeader = true
  }

  getBlockHeader () {
    return this.blockHeader
  }

  getBlockHeaderBuffer () {
    return this.blockHeaderBuffer
  }

  getBlockHeaderPOWBuffer () {
    this._generateBlockHeaderPOWBuffer()
    return this.blockHeaderPOWBuffer
  }

  getBlockHeaderPOWHashBuffer () {
    this._generateBlockHeaderPOWBuffer()
    return this.util.rlphash(this.blockHeaderPOWBuffer)
  }

  getBlockHeaderHash () {
    return this.util.rlphash(this.blockHeaderBuffer).toString('hex')
  }

  setBlockBody (body) {
    this.blockBody = body
    this.block.Transactions = this.blockBody
    this._generateBlockBodyBuffer()
    this.hasBody = true
  }

  setBlockBodyFromBuffer (bodyBuffer) {
    this.blockBodyBuffer = bodyBuffer
    this.blockBodyBuffer.forEach(txBuffer => {
      this.blockBody.push(JSON.parse(txBuffer.toString()))
    })
    this.block.Transactions = this.blockBody.slice(0)
    this.hasBody = true
  }

  getBlockBody () {
    return this.blockBody
  }

  getBlockBodyBuffer () {
    return this.blockBodyBuffer
  }

  getBlockBodyHash () {
    return this.util.rlphash(this.blockBodyBuffer).toString('hex')
  }

  isHeaderEmpty () {
    return !this.hasHeader
  }

  isBodyEmpty () {
    return !this.hasBody
  }

  /**
    * assign value to block header
    */
  _generateBlock () {
    // Header
    this.blockHeader.Number = this.transactionBlockChain ? parseInt(this.transactionBlockChain.getCurrentHeight()) + 1 : this.config.Number || 0
    this.blockHeader.TransactionsRoot = this.config.TransactionsRoot
    this.blockHeader.ReceiptRoot = this.config.ReceiptRoot
    this.blockHeader.TimeStamp = this.config.TimeStamp || this.util.currentUnixTimeSecond()
    this.blockHeader.ParentHash = this.config.ParentHash
    this.blockHeader.ExtraData = this.config.ExtraData
    this.blockHeader.Nonce = this.config.Nonce

    this.block = Object.assign({}, this.blockHeader)
    this.block.Beneficiary = this.config.Beneficiary
    this._generateBlockHeaderBuffer()
    this.block.Hash = this.util.rlphash(this.blockHeaderBuffer).toString('hex')

    // Body
    this.blockBody = this.config.Transactions
    this.block.Transactions = this.blockBody
    this._generateBlockBodyBuffer()
    this.hasHeader = true
    this.hasBody = true
    this._generateBlockBuffer()
  }

  _generateBlockBuffer () {
    this.blockBuffer = [
      this.util.intToBuffer(this.block.Number),
      Buffer.from(this.block.TransactionsRoot, 'hex'),
      Buffer.from(this.block.ReceiptRoot, 'hex'),
      this.util.intToBuffer(this.block.TimeStamp),
      Buffer.from(this.block.ParentHash, 'hex'),
      Buffer.from(this.block.ExtraData),
      Buffer.from(this.block.Nonce, 'hex'),
      Buffer.from(this.block.Hash, 'hex'),
      Buffer.from(this.block.Beneficiary),
      Buffer.from(JSON.stringify(this.block.Transactions))
    ]
  }

  _generateBlockHeaderBuffer () {
    this.blockHeaderBuffer = [
      this.util.intToBuffer(this.blockHeader.Number),
      Buffer.from(this.blockHeader.TransactionsRoot, 'hex'),
      Buffer.from(this.blockHeader.ReceiptRoot, 'hex'),
      this.util.intToBuffer(this.blockHeader.TimeStamp),
      Buffer.from(this.blockHeader.ParentHash, 'hex'),
      Buffer.from(this.blockHeader.ExtraData),
      Buffer.from(this.blockHeader.Nonce, 'hex')
    ]
  }

  _generateBlockHeaderPOWBuffer () {
    this.blockHeaderPOWBuffer = [
      this.util.intToBuffer(this.blockHeader.Number),
      Buffer.from(this.blockHeader.ExtraData),
      Buffer.from(this.blockHeader.Nonce, 'hex')
    ]
  }

  _generateBlockBodyBuffer () {
    if (this.blockBody.length !== 0) {
      this.blockBody.forEach(tx => {
        this.blockBodyBuffer.push(Buffer.from(JSON.stringify(tx)))
      })
    }
  }
}

module.exports = SECTransactionBlock
