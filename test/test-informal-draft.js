const TxPool = require('../src/secjs-transaction-pool')
const TxBlock = require('../src/secjs-transaction-block')
const TxBlockChain = require('../src/secjs-transaction-blockchain')
const TkBlock = require('../src/secjs-token-block')
const TkBlockChain = require('../src/secjs-token-blockchain')
const TxTransModel = require('../model/transactionchain-trans-model')
const TkTransModel = require('../model/tokenchain-trans-model')
const randomGen = require('../src/secjs-random-generate')
const fs = require('fs')

let txchainFile = './txblockchain.json'
let tokenchainFile = './tokenblockchain.json'

let tranPool = new TxPool(null, true)
let tokenPool = new TxPool(null, false)
let tranBlock = new TxBlock()
let tokenBlock = new TkBlock()

addTxToPool(10)
tranBlock.generateBlock(tranPool)
tokenBlock.generateBlock(tokenPool)

readBlock(txchainFile, (err, data) => {
  let transBlockChain = new TxBlockChain(data)
  transBlockChain.addBlockToChain(tranBlock.block)

  try {
    fs.writeFile(txchainFile, JSON.stringify(transBlockChain.txBlockChain), err)
  } catch (err) {
    throw new Error(err)
  }

  console.log(transBlockChain.getLastBlockHash())
})

readBlock(tokenchainFile, (err, data) => {
  let tokenBlockChain = new TkBlockChain(data)
  tokenBlockChain.addBlockToChain(tokenBlock.block)

  try {
    fs.writeFile(tokenchainFile, JSON.stringify(tokenBlockChain.tokenBlockChain), err)
  } catch (err) {
    throw new Error(err)
  }

  console.log(tokenBlockChain.getLastBlockHash())
})

function readBlock (file, callback) {
  fs.readFile(file, callback)
}

function addTxToPool (num) {
  for (let i = 0; i < num; i++) {
    tranPool.addTxIntoPool(generateTxTransaction())
    tokenPool.addTxIntoPool(generateTokenTransaction())
  }
}

function generateTxTransaction () {
  let transactionBlock = TxTransModel

  transactionBlock.txHash = randomGen.randomGenerate('string', 32)
  transactionBlock.TxReceiptStatus = 'pending'
  transactionBlock.BlockHeight = randomGen.randomGenerate('number', 1000)
  transactionBlock.TimeStamp = new Date().getTime()
  transactionBlock.SellerAddress = randomGen.randomGenerate('string', 32)
  transactionBlock.BuyerAddress = randomGen.randomGenerate('string', 32)
  // transactionBlock.ShareHash = randomGen.randomGenerate("string", 32)
  // transactionBlock.ShareTimeStamp = randomGen.randomGenerate("string", 32)

  transactionBlock.ProductInfo = {}
  transactionBlock.ProductInfo.Name = randomGen.randomGenerate('string', 6)
  transactionBlock.ProductInfo.Category = randomGen.randomGenerate('number', 10)
  transactionBlock.ProductInfo.Brand = randomGen.randomGenerate('string', 6)
  transactionBlock.ProductInfo.Manifactory = randomGen.randomGenerate('string', 6)
  transactionBlock.ProductInfo.Seller = randomGen.randomGenerate('string', 6)
  transactionBlock.ProductInfo.Buyer = randomGen.randomGenerate('string', 6)
  // transactionBlock.ProductInfo.SKU = randomGen.randomGenerate("string", 6)
  // transactionBlock.ProductInfo.EAN = randomGen.randomGenerate("string", 6)
  transactionBlock.ProductInfo.Price = randomGen.randomGenerate('number', 6)
  transactionBlock.ProductInfo.Currency = randomGen.randomGenerate('number', 6)
  transactionBlock.ProductInfo.Description = randomGen.randomGenerate('string', 20)

  // transactionBlock.SharedTimes = new Date().getTime();
  transactionBlock.Status = 'pending'
  transactionBlock.InputData = randomGen.randomGenerate('string', 20)

  return transactionBlock
}

function generateTokenTransaction () {
  let tokenlock = TkTransModel

  tokenlock.txHash = randomGen.randomGenerate('string', 32)
  tokenlock.TxReceiptStatus = 'pending'
  tokenlock.Version = '1.0'
  tokenlock.BlockHeight = randomGen.randomGenerate('number', 1000)
  tokenlock.TimeStamp = new Date().getTime()
  tokenlock.TxFrom = randomGen.randomGenerate('string', 32)
  tokenlock.TxTo = randomGen.randomGenerate('string', 32)
  tokenlock.Value = randomGen.randomGenerate('number', 100000)
  tokenlock.Nonce = randomGen.randomGenerate('string', 32) // powCal.getNonce(this.block)
  tokenlock.InputData = randomGen.randomGenerate('string', 20)

  return tokenlock
}
