const SECDataHandler = require('@biut-block/biutjs-datahandler')
const SECBlockchain = require('../src/index')
const dbconfig = {
  DBPath: process.cwd() + '/data',
  ID: 'TestID'
}

const tokenDH = new SECDataHandler.TokenBlockChainDB(dbconfig)
const tokenBlockChain = new SECBlockchain.SECTokenBlockChain(tokenDH)

tokenBlockChain.init((e) => {
  if (e) {
    console.log(e)
  } else {
    tokenBlockChain.accTree.getRoots((err, value) => {
      if (err) console.log(err)
      else {
        console.log(value)
      }
    })
  }
})

// const accConfig = {
//   DBPath: '../data/test/tokenBlockChain'
// }

// let accTree = new SECDataHandler.AccTreeDB(accConfig)

// accTree.getRoot((e, data) => {
//   console.log(data)
// })
