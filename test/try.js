const SECDataHandler = require('@sec-block/secjs-datahandler')
const SECBlockchain = require('../src/index')
const dbconfig = {
  DBPath: process.cwd() + '/data',
  ID: 'TestID'
}

const tokenDH = new SECDataHandler.TokenBlockChainDB(dbconfig)
const tokenBlockChain = new SECBlockchain.SECTokenBlockChain(tokenDH)

tokenBlockChain.init((e) => {
  console.log(e)
})
