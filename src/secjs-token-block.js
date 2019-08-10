const SECUtils = require('@biut-block/biutjs-util')
const SECTokenBlockModel = require('../model/tokenchain-block-model')
const SECMerkleTree = require('@biut-block/biutjs-merkle-tree')

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

    this.block.Transactions.forEach((tx, index) => {
      if (typeof tx === 'string') {
        block.Transactions[index] = JSON.parse(tx)
      }
    })

    // GasUsed, GasLimit
    this.block['GasUsed'] = 0
    this.block['GasLimit'] = 0
    let txHashArray = []
    this.block['Transactions'].forEach(tx => {
      self.block['GasUsed'] += parseFloat(tx.GasUsedByTxn)
      self.block['GasLimit'] += parseFloat(tx.GasLimit)
      txHashArray.push(tx.TxHash)
    })
    this.block['GasUsed'] = this.block['GasUsed'].toString()
    this.block['GasLimit'] = this.block['GasLimit'].toString()

    // TransactionsRoot
    if (txHashArray.length === 0) {
      this.block['TransactionsRoot'] = SECUtils.KECCAK256_RLP.toString('hex')
    } else {
      let merkleTree = new SECMerkleTree(txHashArray, 'sha256')
      this.block['TransactionsRoot'] = merkleTree.getRoot().toString('hex')
    }

    // Hash
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
      Number: this.block.Number,
      TransactionsRoot: this.block.TransactionsRoot,
      ReceiptRoot: this.block.ReceiptRoot,
      LogsBloom: this.block.LogsBloom,
      MixHash: this.block.MixHash,
      StateRoot: this.block.StateRoot,
      TimeStamp: this.block.TimeStamp,
      ParentHash: this.block.ParentHash,
      Difficulty: this.block.Difficulty,
      GasUsed: this.block.GasUsed,
      GasLimit: this.block.GasLimit,
      ExtraData: this.block.ExtraData,
      Nonce: this.block.Nonce,
      Beneficiary: this.block.Beneficiary
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
      this.blockBuffer[13], // Hash
      this.blockBuffer[14] // Beneficiary
    ]
    return headerBuffer
  }

  setHeader (header) {
    if (!(Array.isArray(header))) {
      // set header from json data
      this._setHeaderFromJson(header)
    } else {
      // set header from headerBuffer data
      this._setHeaderFromBuffer(header)
    }
  }

  _setHeaderFromJson (header) {
    this.block.Number = header.Number
    this.block.TransactionsRoot = header.TransactionsRoot
    this.block.ReceiptRoot = header.ReceiptRoot
    this.block.LogsBloom = header.LogsBloom
    this.block.MixHash = header.MixHash
    this.block.StateRoot = header.StateRoot
    this.block.TimeStamp = header.TimeStamp
    this.block.ParentHash = header.ParentHash
    this.block.Difficulty = header.Difficulty
    this.block.GasUsed = header.GasUsed
    this.block.GasLimit = header.GasLimit
    this.block.ExtraData = header.ExtraData
    this.block.Nonce = header.Nonce
    this.block.Beneficiary = header.Beneficiary
  }

  _setHeaderFromBuffer (headerBuffer) {
    this.block.Number = SECUtils.bufferToInt(headerBuffer[0])
    this.block.TransactionsRoot = headerBuffer[1].toString('hex')
    this.block.ReceiptRoot = headerBuffer[2].toString('hex')
    this.block.LogsBloom = headerBuffer[3].toString('hex')
    this.block.MixHash = headerBuffer[4].toString('hex')
    this.block.StateRoot = headerBuffer[5].toString('hex')
    this.block.TimeStamp = SECUtils.bufferToInt(headerBuffer[6])
    this.block.ParentHash = headerBuffer[7].toString('hex')
    this.block.Difficulty = headerBuffer[8].toString()
    this.block.GasUsed = headerBuffer[9].toString()
    this.block.GasLimit = headerBuffer[10].toString()
    this.block.ExtraData = headerBuffer[11].toString()
    this.block.Nonce = headerBuffer[12].toString('hex')
    this.block.Hash = headerBuffer[13].toString('hex')
    this.block.Beneficiary = headerBuffer[14].toString('hex')
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

  static getHeaderHashStatic (block) {
    let headerBuffer = [
      SECUtils.intToBuffer(block.Number),
      Buffer.from(block.TransactionsRoot, 'hex'),
      Buffer.from(block.ReceiptRoot, 'hex'),
      Buffer.from(block.LogsBloom, 'hex'),
      Buffer.from(block.MixHash, 'hex'),
      Buffer.from(block.StateRoot, 'hex'),
      SECUtils.intToBuffer(block.TimeStamp),
      Buffer.from(block.ParentHash, 'hex'),
      Buffer.from(block.Difficulty),
      Buffer.from(block.GasUsed),
      Buffer.from(block.GasLimit),
      Buffer.from(block.ExtraData),
      Buffer.from(block.Nonce, 'hex'),
      Buffer.from(block.Beneficiary, 'hex')
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
    return blockBodyBuffer
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
      this.blockBuffer[6], // Timestamp
      this.blockBuffer[7], // ParentHash
      this.blockBuffer[9], // GasUsed
      this.blockBuffer[10], // GasLimit
      this.blockBuffer[11] // ExtraData
    ]
    return powHeaderBuffer
  }

  verifyHeaderHash () {
    // verify block header hash
    let header = this.getHeaderBuffer()
    let headerHash = SECUtils.rlphash(header).toString('hex')
    if (headerHash === this.block.Hash) {
      return true
    }

    return false
  }

  verifyTxRoot () {
    // verify block header transaction root
    let txHashArray = []
    this.block['Transactions'].forEach(tx => {
      txHashArray.push(tx.TxHash)
    })

    let txRoot = ''
    if (txHashArray.length === 0) {
      txRoot = SECUtils.KECCAK256_RLP.toString('hex')
    } else {
      let merkleTree = new SECMerkleTree(txHashArray, 'sha256')
      txRoot = merkleTree.getRoot().toString('hex')
    }

    if (txRoot === this.block['TransactionsRoot']) {
      return true
    }
    return false
  }
}

module.exports = SECTokenBlock
