const SECDataHandler = require('@sec-block/secjs-datahandler')
const SECBlockchain = require('../src/index')
const dbconfig = {
  DBPath: process.cwd() + '/data',
  ID: 'TestID'
}

const tokenDH = new SECDataHandler.TokenBlockChainDB(dbconfig)
const tokenBlockChain = new SECBlockchain.SECTokenBlockChain(tokenDH)

tokenBlockChain.init((e) => {
  console.log('abc')
  if (e) {
    console.log(e)
  } else {
    console.log(tokenBlockChain.accTree.getRoots((err, value) => {
      console.log(err)
      console.log(value)
    }))
  }
})



// const accConfig = {
//   DBPath: '../data/test/tokenBlockChain'
// }

// let accTree = new SECDataHandler.AccTreeDB(accConfig)

// accTree.getRoot((e, data) => {
//   console.log(data)
// })
