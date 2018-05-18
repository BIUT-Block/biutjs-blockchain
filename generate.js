const txBlockChain = require('./utils/secjs-transaction-blockchain')
const txPool = require('./utils/secjs-transaction-pool')
const txBlock = require('./utils/secjs-transaction-block')
const txTransModel = require('./model/transactionchain-trans-model')
const randomGen = require('./utils/secjs-random-generate')
const fs = require('fs')

let chain_file = "./blockchain-example.json"

let tranPool = new txPool()
let tranBlock = new txBlock()


blockHeight = randomGen.randomGenerate("number", 10000)
txBlock_Chain = {
	currentHeight: blockHeight,
	lastBlockHash: randomGen.randomGenerate("string", 32)
}


addTxToPool(10)
tranBlock.generateBlock(tranPool, txBlock_Chain)


readBlock(chain_file, (err, data) => {
	let transBlockChain = new txBlockChain(data)
	transBlockChain.addBlockToChain(tranBlock.block)
	
	fs.writeFile(chain_file, JSON.stringify(transBlockChain.txBlockChain), (err) => {
		if (err) 
			throw err 
	})
	
	console.log(transBlockChain.getLastBlockHash())
})


function readBlock(file, callback){
	fs.readFile(file, callback)
}



function addTxToPool(num) {
	for(let i = 0; i < num; i++){
		tranPool.addTxIntoPool(generateTransaction())
	}
}

function generateTransaction() {
	let transactionBlock = txTransModel
	
	transactionBlock.txHash= randomGen.randomGenerate("string", 32)
	transactionBlock.TxReceiptStatus = 'pending'
	transactionBlock.BlockHeight = blockHeight
	transactionBlock.TimeStamp = new Date().getTime();
	transactionBlock.SellerAddress = randomGen.randomGenerate("string", 32)
	transactionBlock.BuyerAddress = randomGen.randomGenerate("string", 32)
	//transactionBlock.ShareHash = randomGen.randomGenerate("string", 32)
	//transactionBlock.ShareTimeStamp = randomGen.randomGenerate("string", 32)
	
	transactionBlock.ProductInfo = {}
	transactionBlock.ProductInfo.Name = randomGen.randomGenerate("string", 6)
	transactionBlock.ProductInfo.Category = randomGen.randomGenerate("number", 10)
	transactionBlock.ProductInfo.Brand = randomGen.randomGenerate("string", 6)
	transactionBlock.ProductInfo.Manifactory = randomGen.randomGenerate("string", 6)
	transactionBlock.ProductInfo.Seller = randomGen.randomGenerate("string", 6)
	transactionBlock.ProductInfo.Buyer = randomGen.randomGenerate("string", 6)
	//transactionBlock.ProductInfo.SKU = randomGen.randomGenerate("string", 6)
	//transactionBlock.ProductInfo.EAN = randomGen.randomGenerate("string", 6)
	transactionBlock.ProductInfo.Price = randomGen.randomGenerate("number", 6)
	transactionBlock.ProductInfo.Currency = randomGen.randomGenerate("number", 6)
	transactionBlock.ProductInfo.Description = randomGen.randomGenerate("string", 20)
	
	//transactionBlock.SharedTimes = new Date().getTime();
	transactionBlock.Status = "pending"
	transactionBlock.InputData = randomGen.randomGenerate("string", 20)

	return transactionBlock
}