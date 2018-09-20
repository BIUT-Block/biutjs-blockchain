const assert = require('assert')
const SECTokenBlock = require('../src/secjs-token-block')
const SECTransactionBlock = require('../src/secjs-transaction-block')
const SECTokenBlockchain = require('../src/secjs-token-blockchain')
const SECTransactionBlockchain = require('../src/secjs-transaction-blockchain')
const SECDataHandler = require('@sec-block/secjs-datahandler')
const dbconfig = {
  DBPath: process.cwd() + '/data',
  ID: '35745897015978'
}
const TokenBlockchainDataHandler = new SECDataHandler.TokenBlockChainDB(dbconfig)
const TxBlockchainDataHandler = new SECDataHandler.TxBlockChainDB(dbconfig)

const tokenBlockData = require('./mock-data').tokenBlock
let tokenBlock = new SECTokenBlock(tokenBlockData)
let block = new SECTokenBlock()
console.log(tokenBlock.getBlockBuffer())
block.setBlockFromBuffer(tokenBlock.getBlockBuffer())
console.log(block.getBlockHeaderBuffer())
console.log(block.getBlockHeader())
console.log(block.getBlockBodyBuffer())
console.log(block.getBlockBody())
console.log(block.getBlockBuffer())
assert.deepEqual(block.getBlockBuffer(), tokenBlock.getBlockBuffer())

const transactionBlockData = require('./mock-data').transactionBlock
let transactionBlock = new SECTransactionBlock(transactionBlockData)
block = new SECTransactionBlock()
console.log(transactionBlock.getBlockBuffer())
block.setBlockFromBuffer(transactionBlock.getBlockBuffer())
console.log(block.getBlockHeaderBuffer())
console.log(block.getBlockHeader())
console.log(block.getBlockBodyBuffer())
console.log(block.getBlockBody())
console.log(block.getBlockBuffer())
assert.deepEqual(block.getBlockBuffer(), transactionBlock.getBlockBuffer())

let tokenBlockchain = new SECTokenBlockchain(TokenBlockchainDataHandler)
tokenBlockchain.init(() => {
  tokenBlockchain.putBlockToDB(tokenBlock, () => {
    tokenBlockchain.getBlockChain().forEach(block => {
      console.log(block)
    })
  })
})

let transactionBlockchain = new SECTransactionBlockchain(TxBlockchainDataHandler)
transactionBlockchain.init(() => {
  transactionBlockchain.putBlockToDB(transactionBlock, () => {
    transactionBlockchain.getBlockChain().forEach(block => {
      console.log(block)
    })
  })
})
