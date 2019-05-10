const SECDatahandler = require('@biut-block/biutjs-datahandler')

const config = {
  DBPath: '../data/test/tokenBlockChain'
}

let accTree = new SECDatahandler.AccTreeDB(config)

accTree.getRoots((e, data) => {
  console.log(data)
})
