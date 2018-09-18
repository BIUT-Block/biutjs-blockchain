const SECTokenBlock = require('./src/secjs-token-block')
const SECTransactionBlock = require('./src/secjs-transaction-block')
const SECTokenBlockchain = require('./src/secjs-token-blockchain')
const SECTransactionBlockchain = require('./src/secjs-transaction-blockchain')
const SECDataHandler = require('@sec-block/secjs-datahandler')
const dbconfig = {
  DBPath: process.cwd() + '/data',
  ID: '35745897015978'
}
const TokenBlockchainDataHandler = new SECDataHandler.TokenBlockChainDB(dbconfig)
const TxBlockchainDataHandler = new SECDataHandler.TxBlockChainDB(dbconfig)

let tokenBlock = new SECTokenBlock(require('./test/mock-data').tokenBlock).getBlock()

let transactionBlock = new SECTransactionBlock(require('./test/mock-data').transactionBlock).getBlock()

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
