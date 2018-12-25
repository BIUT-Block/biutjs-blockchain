const SECUtils = require('@sec-block/secjs-util')
const SECTokenBlockModel = require('../model/tokenchain-block-model')

const tokenBufferLength = 16

class SECTokenBlock {
  /**
    * create a token chain block with config
    * @param {*} config
    *
    */
  constructor (block = {}) {
    this.blockBuffer = []
    this.block = SECTokenBlockModel

    if (Object.keys(block).length !== 0) {
      this.setBlock(block)
    }
  }

  // --------------------------------------------------------------------------- //
  // -------------------------------  Set Block  ------------------------------- //
  // --------------------------------------------------------------------------- //

  getBlock () {
    return this.block
  }

  getBlockBuffer () {
    return this.blockBuffer
  }

  setBlock (block) {
    if (!(Array.isArray(block))) {
      // set block from json data
      this._setBlockFromJson(block)
    } else {
      // set block from blockBuffer data
      this._setBlockFromBuffer(block)
    }
  }

  _setBlockFromJson (block) {
    let self = this

    // clear this.block
    this.block = SECTokenBlockModel

    // set this.block
    Object.keys(block).forEach(function (key) {
      if (!(key in block)) {
        throw new Error(`key: ${key} is not recognized`)
      }
      self.block[key] = block[key]
    })

    // calculate GasUsed, GasLimit, Hash and TransactionsRoot
    // TBD: LogsBloom, ReceiptRoot, StateRoot
    this.block['GasUsed'] = 0
    this.block['GasLimit'] = 0
    this.block['Transactions'].forEach(tx => {
      console.log(tx)
      self.block['GasUsed'] += parseFloat(tx.GasUsedByTxn)
      self.block['GasLimit'] += parseFloat(tx.GasLimit)
      // self.block['TransactionsRoot'] = ''
    })
    this.block['GasUsed'] = this.block['GasUsed'].toString()
    this.block['GasLimit'] = this.block['GasLimit'].toString()
    this.block['Hash'] = this.getHeaderHash()

    // set this.blockBuffer
    this.blockBuffer = [
      SECUtils.intToBuffer(this.block.Number),
      Buffer.from(this.block.TransactionsRoot, 'hex'),
      Buffer.from(this.block.ReceiptRoot, 'hex'),
      Buffer.from(this.block.LogsBloom, 'hex'),
      Buffer.from(this.block.MixHash, 'hex'),
      Buffer.from(this.block.StateRoot, 'hex'),
      SECUtils.intToBuffer(this.block.TimeStamp),
      Buffer.from(this.block.ParentHash, 'hex'),
      Buffer.from(this.block.Difficulty),
      Buffer.from(this.block.GasUsed),
      Buffer.from(this.block.GasLimit),
      Buffer.from(this.block.ExtraData),
      Buffer.from(this.block.Nonce, 'hex'),
      Buffer.from(this.block.Hash, 'hex'),
      Buffer.from(this.block.Beneficiary, 'hex'),
      Buffer.from(JSON.stringify(this.block.Transactions))
    ]
  }

  _setBlockFromBuffer (blockBuffer) {
    // clear this.block
    this.block = SECTokenBlockModel

    if (blockBuffer.length !== tokenBufferLength) {
      throw new Error(`input blockBuffer length(${blockBuffer.length}) mismatch, its length should be: ${tokenBufferLength}`)
    }

    // set this.block
    this.block = {
      Number: SECUtils.bufferToInt(blockBuffer[0]),
      TransactionsRoot: blockBuffer[1].toString('hex'),
      ReceiptRoot: blockBuffer[2].toString('hex'),
      LogsBloom: blockBuffer[3].toString('hex'),
      MixHash: blockBuffer[4].toString('hex'),
      StateRoot: blockBuffer[5].toString('hex'),
      TimeStamp: SECUtils.bufferToInt(blockBuffer[6]),
      ParentHash: blockBuffer[7].toString('hex'),
      Difficulty: blockBuffer[8].toString(),
      GasUsed: blockBuffer[9].toString(),
      GasLimit: blockBuffer[10].toString(),
      ExtraData: blockBuffer[11].toString(),
      Nonce: blockBuffer[12].toString('hex'),
      Hash: blockBuffer[13].toString('hex'),
      Beneficiary: blockBuffer[14].toString('hex'),
      Transactions: JSON.parse(blockBuffer[15].toString())
    }

    // set this.blockBuffer
    this.blockBuffer = blockBuffer
  }

  // ----------------------------------------------------------------------- //
  // ---------------------------  Block Header  ---------------------------- //
  // ----------------------------------------------------------------------- //

  getHeader () {
    let header = {
      Number: this.tx.Number,
      TransactionsRoot: this.tx.TransactionsRoot,
      ReceiptRoot: this.tx.ReceiptRoot,
      LogsBloom: this.tx.LogsBloom,
      MixHash: this.tx.MixHash,
      StateRoot: this.tx.StateRoot,
      TimeStamp: this.tx.TimeStamp,
      ParentHash: this.tx.ParentHash,
      Difficulty: this.tx.Difficulty,
      GasUsed: this.tx.GasUsed,
      GasLimit: this.tx.GasLimit,
      ExtraData: this.tx.ExtraData,
      Nonce: this.tx.Nonce,
      Beneficiary: this.tx.Beneficiary
    }
    return header
  }

  getHeaderBuffer () {
    if (this.blockBuffer.length !== tokenBufferLength) {
      throw new Error(`this.blockBuffer is not correctly set, it should have a length of: ${tokenBufferLength}`)
    }

    let headerBuffer = [
      this.blockBuffer[0], // Number
      this.blockBuffer[1], // TransactionsRoot
      this.blockBuffer[2], // ReceiptRoot
      this.blockBuffer[3], // LogsBloom
      this.blockBuffer[4], // MixHash
      this.blockBuffer[5], // StateRoot
      this.blockBuffer[6], // TimeStamp
      this.blockBuffer[7], // ParentHash
      this.blockBuffer[8], // Difficulty
      this.blockBuffer[9], // GasUsed
      this.blockBuffer[10], // GasLimit
      this.blockBuffer[11], // ExtraData
      this.blockBuffer[12], // Nonce
      this.blockBuffer[14] // Beneficiary
    ]
    return headerBuffer
  }

  setHeader (header) {
    if (!(Array.isArray(header))) {
      // set header from json data
      this.setBlock(header)
    } else {
      // set header from headerBuffer data
      this._setHeaderFromBuffer(header)
    }
  }

  _setHeaderFromBuffer (blockHeaderBuffer) {
    this.block.Number = SECUtils.bufferToInt(blockHeaderBuffer[0])
    this.block.TransactionsRoot = blockHeaderBuffer[1].toString('hex')
    this.block.ReceiptRoot = blockHeaderBuffer[2].toString('hex')
    this.block.LogsBloom = blockHeaderBuffer[3].toString('hex')
    this.block.MixHash = blockHeaderBuffer[4].toString('hex')
    this.block.StateRoot = blockHeaderBuffer[5].toString('hex')
    this.block.TimeStamp = SECUtils.bufferToInt(blockHeaderBuffer[6])
    this.block.ParentHash = blockHeaderBuffer[7].toString('hex')
    this.block.Difficulty = blockHeaderBuffer[8].toString()
    this.block.GasUsed = blockHeaderBuffer[9].toString()
    this.block.GasLimit = blockHeaderBuffer[10].toString()
    this.block.ExtraData = blockHeaderBuffer[11].toString()
    this.block.Nonce = blockHeaderBuffer[12].toString('hex')
    this.block.Beneficiary = blockHeaderBuffer[14].toString('hex')

    // update this.blockBuffer
    this.setBlock(this.block)
  }

  getHeaderHash () {
    let headerBuffer = [
      SECUtils.intToBuffer(this.block.Number),
      Buffer.from(this.block.TransactionsRoot, 'hex'),
      Buffer.from(this.block.ReceiptRoot, 'hex'),
      Buffer.from(this.block.LogsBloom, 'hex'),
      Buffer.from(this.block.MixHash, 'hex'),
      Buffer.from(this.block.StateRoot, 'hex'),
      SECUtils.intToBuffer(this.block.TimeStamp),
      Buffer.from(this.block.ParentHash, 'hex'),
      Buffer.from(this.block.Difficulty),
      Buffer.from(this.block.GasUsed),
      Buffer.from(this.block.GasLimit),
      Buffer.from(this.block.ExtraData),
      Buffer.from(this.block.Nonce, 'hex'),
      Buffer.from(this.block.Beneficiary, 'hex')
    ]

    return SECUtils.rlphash(headerBuffer).toString('hex')
  }

  // ----------------------------------------------------------------------- //
  // -----------------------------  Block Body  ---------------------------- //
  // ----------------------------------------------------------------------- //

  getBody () {
    return this.block.Transactions
  }

  getBodyBuffer () {
    let blockBody = this.block.Transactions
    let blockBodyBuffer = []

    if (blockBody.length !== 0) {
      blockBody.forEach(tx => {
        blockBodyBuffer.push(Buffer.from(JSON.stringify(tx)))
      })
    }
    return blockBody
  }

  setBody (body) {
    if (!(Array.isArray(body))) {
      // set body from json data
      this.setBlock(body)
    } else {
      // set body from bodyBuffer data
      this._setBodyFromBuffer(body)
    }
  }

  _setBodyFromBuffer (bodyBuffer) {
    this.block.Transactions = []
    bodyBuffer.forEach(txBuffer => {
      this.block.Transactions.push(JSON.parse(txBuffer.toString()))
    })
  }

  getBodyHash () {
    let bodyBuffer = this.getBodyBuffer()
    return SECUtils.rlphash(bodyBuffer).toString('hex')
  }

  // --------------------------------------------------------------------------- //
  // ---------------------------  POW Header Buffer  --------------------------- //
  // --------------------------------------------------------------------------- //

  getPowHeaderBuffer () {
    if (this.blockBuffer.length !== tokenBufferLength) {
      throw new Error(`this.blockBuffer is not correctly set, it should have a length of: ${tokenBufferLength}`)
    }

    let powHeaderBuffer = [
      this.blockBuffer[0], // Number
      this.blockBuffer[5], // StateRoot
      this.blockBuffer[8], // Difficulty
      this.blockBuffer[10], // GasLimit
      this.blockBuffer[11], // ExtraData
      this.blockBuffer[12] // Nonce
    ]
    return powHeaderBuffer
  }

  getPowHeaderHashBuffer () {
    let powHeaderBuffer = this.getPowHeaderBuffer()
    return SECUtils.rlphash(powHeaderBuffer)
  }
}

module.exports = SECTokenBlock
