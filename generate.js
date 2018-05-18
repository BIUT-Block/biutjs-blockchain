const txPool = require('./utils/secjs-transaction-pool')
const txBlock = require('./utils/secjs-transaction-block')
const txBlockChain = require('./utils/secjs-transaction-blockchain')
const tkBlock = require('./utils/secjs-token-block')
const tkBlockChain = require('./utils/secjs-token-blockchain')
const txTransModel = require('./model/transactionchain-trans-model')
const tkTransModel = require('./model/tokenchain-trans-model')
const randomGen = require('./utils/secjs-random-generate')
const fs = require('fs')

let txchain_file = "./txblockchain.json"
let tokenchain_file = "./tokenblockchain.json"

let tranPool = new txPool()
let tokenPool = new txPool()
let tranBlock = new txBlock()
let tokenBlock = new tkBlock()


addTxToPool(10)
tranBlock.generateBlock(tranPool)
tokenBlock.generateBlock(tokenPool)


readBlock(txchain_file, (err, data) => {
	let transBlockChain = new txBlockChain(data)
	transBlockChain.addBlockToChain(tranBlock.block)
	
	fs.writeFile(txchain_file, JSON.stringify(transBlockChain.txBlockChain), (err) => {
		if (err) 
			throw err 
	})
	
	console.log(transBlockChain.getLastBlockHash())
})


readBlock(tokenchain_file, (err, data) => {
	let tokenBlockChain = new tkBlockChain(data)
	tokenBlockChain.addBlockToChain(tokenBlock.block)
	
	fs.writeFile(tokenchain_file, JSON.stringify(tokenBlockChain.tokenBlockChain), (err) => {
		if (err) 
			throw err 
	})
	
	console.log(tokenBlockChain.getLastBlockHash())
})


function readBlock(file, callback){
	fs.readFile(file, callback)
}



function addTxToPool(num) {
	for(let i = 0; i < num; i++){
		tranPool.addTxIntoPool(generateTxTransaction())
		tokenPool.addTxIntoPool(generateTokenTransaction())
	}
}

function generateTxTransaction() {
	let transactionBlock = txTransModel
	
	transactionBlock.txHash= randomGen.randomGenerate("string", 32)
	transactionBlock.TxReceiptStatus = 'pending'
	transactionBlock.BlockHeight = randomGen.randomGenerate("number", 1000)
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

function generateTokenTransaction() {
	let tokenlock = tkTransModel
	
	tokenlock.txHash= randomGen.randomGenerate("string", 32)
	tokenlock.TxReceiptStatus = 'pending'
	tokenlock.Version = "1.0"
	tokenlock.BlockHeight = randomGen.randomGenerate("number", 1000)
	tokenlock.TimeStamp = new Date().getTime();
	tokenlock.TxFrom = randomGen.randomGenerate("string", 32)
	tokenlock.TxTo = randomGen.randomGenerate("string", 32)
	tokenlock.Value = randomGen.randomGenerate("number", 100000)
    tokenlock.Nonce = randomGen.randomGenerate("string", 32)						//powCal.getNonce(this.block)
	tokenlock.InputData = randomGen.randomGenerate("string", 20)

	return tokenlock
}