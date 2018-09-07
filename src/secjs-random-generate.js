const SECUtils = require('@sec-block/secjs-util')
const crypto = require('crypto')
const ProductInfo = require('../model/product')

// Methode of generating Hash
const supportedHashAlgo = [
  'md5',
  'sha1',
  'sha256',
  'sha512',
  'ripemd160'
]
class SECHash {
  constructor (hashalgo) {
    if (supportedHashAlgo.indexOf(hashalgo) < 0) {
      throw new TypeError('Expected a supported hash algorithm')
    }
    this.hashalgo = hashalgo
  }

  /**
  * hash
  * @desc Returns hash result
  * @param {String} data - Data for hash calculation
  * @param {String} hashalgo - Hash algorithm, must match "supportedHashAlgo"
  * @return {String}
  * @example
  * const hash = digest("sha256", 'a')
  */
  hash (data) {
    return crypto.createHash(this.hashalgo).update(data).digest('hex')
  }

  getHashLength () {
    if (this.hashalgo === 'md5') {
      return 32 // byte
    } else if (this.hashalgo === 'sha1') {
      return 40 // byte
    } else if (this.hashalgo === 'sha256') {
      return 64 // byte
    } else if (this.hashalgo === 'sha512') {
      return 128 // byte
    } else if (this.hashalgo === 'ripemd160') {
      return 40 // byte
    } else {
      throw TypeError('Wrong hash algorithm')
    }
  }
}

// Methode of generating random data
const randomData = function (type, length) {
  if (length <= 0) {
    throw TypeError('Input length is invalid')
  }
  if (type === 'number') {
    return Math.floor(Math.random() * Math.floor(length))
  } else if (type === 'string') {
    return getRandomString(length)
  } else if (type === 'hex') {
    let resultStr = ''
    for (let i = 0; i < length; i++) {
      let dec = Math.floor(Math.random() * Math.floor(16))
      resultStr += dec.toString(16)
    }
    return resultStr
  } else {
    throw TypeError('Wrong random generate data type, please choose between number, string and hex')
  }
}

function getRandomString (length) {
  let quotient = Math.floor(length / 11)
  let remainder = length % 11
  let result = []

  for (let i = 0; i < quotient; i++) {
    result.push(Math.random().toString(36).substring(2, 13))
  }

  result.push(Math.random().toString(36).substring(2, remainder + 2))

  while (result.join('').length < length) {
    result.push(verifyRandomStringLength(result.join(''), length))
  }

  return result.join('')
}
function verifyRandomStringLength (string, length) {
  if (string.length < length) {
    let diff = length - string.length
    return getRandomString(diff)
  }
}

const Hash = new SECHash('sha256')
const util = new SECUtils('ZH')

class RandomTxDataGenerator {
  constructor () {
    this.TxHash = Hash.hash('transaction 1')
    this.TxReceiptStatus = `success`
    this.Version = '0.0.1'
    this.BlockHeight = randomData('number', 5)
    this.TimeStamp = util.currentUnixTimeInMillisecond()
    this.SellerAddress = util.getAddress('buyer hash')
    this.BuyerAddress = 'sec-frankfurt'// util.getAddress('seller hash')
    this.ShareHash = Hash.hash('buyer hash')
    this.ShareTimeStamp = util.currentUnixTimeInMillisecond()
    this.SharedTimes = 0
    this.Status = `origin`
    this.InputData = `Test Transaction`
    this.ProductInfo = ProductInfo
  }
  generateTxHash () {
    return this.TxHash
  }
  generateTxReceiptStatus () {
    return this.TxReceiptStatus
  }
  generateVersion () {
    return this.Version
  }
  generateBlockHeight () {
    return this.BlockHeight
  }
  generateTimeStamp () {
    return this.TimeStamp
  }
  generateSellerAddress () {
    return this.SellerAddress
  }
  generateBuyerAddress () {
    return this.BuyerAddress
  }
  generateShareHash () {
    return this.ShareHash
  }
  generateShareTimeStamp () {
    return this.ShareTimeStamp
  }
  generateSharedTimes () {
    return this.SharedTimes
  }
  generateStatus () {
    return this.Status
  }
  generateInputData () {
    return this.InputData
  }
  generateProductInfo () {
    //  this.ProductInfo = JSON.parse(this.item)
    return this.ProductInfo
  }
}

class GetTxData {
  constructor (tx) {
    // this.Tx = JSON.parse(JSON.stringify(transaction))
    this.tx = tx
  }
  getData () {
    return this.tx
  }
  getTxHash () {
    return this.tx.TxHash
  }
  getTxReceiptStatus () {
    return this.tx.TxReceiptStatus
  }
  getVersion () {
    return this.tx.Version
  }
  getBlockHeight () {
    return this.tx.BlockHeight
  }
  getTimeStamp () {
    return this.tx.TimeStamp
  }
  getSellerAddress () {
    return this.tx.SellerAddress
  }
  getBuyerAddress () {
    return this.tx.BuyerAddress
  }
  getSharedTimes () {
    return this.tx.SharedTimes
  }
  getShareHash () {
    return this.tx.ShareHash
  }
  getShareTimeStamp () {
    return this.tx.ShareTimeStamp
  }
  getStatus () {
    return this.tx.Status
  }
  getInputData () {
    return this.tx.InputData
  }
  // setProductInfo (product) {
  //   this.tx.ProductInfo = product
  // }
  getProductInfo () {
    return this.tx.ProductInfo
  }
}

class GetTokenTxData {
  constructor (tx) {
    this.tx = tx
  }

  getData () {
    return this.tx
  }
  getTxHash () {
    return this.tx.TxHash
  }
  getTxReceiptStatus () {
    return this.tx.TxReceiptStatus
  }
  getVersion () {
    return this.tx.Version
  }
  getBlockHeight () {
    return this.tx.BlockHeight
  }
  getTimeStamp () {
    return this.tx.TimeStamp
  }
  getTxFrom () {
    return this.tx.TxFrom
  }
  getTxTo () {
    return this.tx.TxTo
  }
  getValue () {
    return this.tx.Value
  }
  getGasLimit () {
    return this.tx.GasLimit
  }
  getGasUsedByTxn () {
    return this.tx.GasUsedByTxn
  }
  getGasPrice () {
    return this.tx.GasPrice
  }
  getTxFee () {
    return this.tx.TxFee
  }
  getNonce () {
    return this.tx.Nonce
  }
  getInputData () {
    return this.tx.InputData
  }
}

class RandomTokenDataGenerator {
  constructor () {
    this.TxHash = Hash.hash('transaction 1')
    this.TxReceiptStatus = `success`
    this.Version = '0.0.1'
    this.BlockHeight = randomData('number', 5)
    this.TimeStamp = util.currentUnixTimeInMillisecond()
    this.TxFrom = util.getAddress('buyer hash')
    this.TxTo = util.getAddress('seller hash')
    // this.ShareHash = Hash.hash('buyer hash')
    this.Value = Math.floor(Math.random() * 2)
    this.GasLimit = Math.floor(Math.random() * 10000)
    this.GasUsedByTxn = Math.floor(Math.random() * 1000)
    this.GasPrice = 0.001
    this.TxFee = Math.random()
    this.Nonce = Math.floor(Math.random() * 10000)
    this.InputData = `Test Token Transaction`
  }
  generateTxHash () {
    return this.TxHash
  }
  generateTxReceiptStatus () {
    return this.TxReceiptStatus
  }
  generateVersion () {
    return this.Version
  }
  generateBlockHeight () {
    return this.BlockHeight
  }
  generateTimeStamp () {
    return this.TimeStamp
  }
  generateTxFrom () {
    return this.TxFrom
  }
  generateTxTo () {
    return this.TxTo
  }
  generateValue () {
    return this.Value
  }
  generateGasLimit () {
    return this.GasLimit
  }
  generateGasUsedByTxn () {
    return this.GasUsedByTxn
  }
  generateGasPrice () {
    return this.GasPrice
  }
  generateTxFee () {
    return this.TxFee
  }
  generateNonce () {
    return this.Nonce
  }
  generateInputData () {
    return this.InputData
  }
}

class randomGenerate {
  /**
   * @param  {} type number, string, or hex
   * @param  {} length wanted length, must be bigger than zero
   */
  generateRandomData (type, length) {
    if (length < 0) {
      throw TypeError('Input length is invalid')
    }
    if (type === 'number') {
      return Math.floor(Math.random() * Math.floor(length))
    } else if (type === 'string') {
      return getRandomString(length)
    } else if (type === 'hex') {
      let resultStr = ''
      for (let i = 0; i < length; i++) {
        let dec = Math.floor(Math.random() * Math.floor(16))
        resultStr += dec.toString(16)
      }
      return resultStr
    } else {
      throw TypeError('Wrong random generate data type')
    }
  }

  /** generate a random transaction chain data of SEC
   * @param  {}
   */
  generateRandomTxData () {
    return new RandomTxDataGenerator()
  }

  /** generate a random token chain data of SEC
   * @param  {}
   */
  generateRandomTokenData () {
    return new RandomTokenDataGenerator()
  }

  /** get a transaction chain data, contains multi functions of single data acquirsition
   * @param  {} tx transaction chain data
   */
  getTxData (tx) {
    return new GetTxData(tx)
  }

  /** get a token chain data, contains multi functions of single data acquirsition
    * @param  {} tx transaction chain data
    */
  getTokenData (tx) {
    return new GetTokenTxData(tx)
  }
}
module.exports = randomGenerate
