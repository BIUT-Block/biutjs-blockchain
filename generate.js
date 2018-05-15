const txPool = require('./utils/secjs-transaction-pool')
const txBlock = require('./utils/secjs-transaction-block')
const txTransModel = require('./model/transactionchain-trans-model')

blockHeight = randomGenerate("number", 10000)
txBlockChain = {
	currentHeight: blockHeight,
	lastBlockHash: randomGenerate("string", 32)
}

var tranPool = new txPool()
var tranBlock = new txBlock()


addTxToPool(10)
tranBlock.generateBlock(tranPool, txBlockChain)

console.log(tranBlock.block)



function addTxToPool(num) {
	for(let i = 0; i < num; i++){
		tranPool.addTxIntoPool(generateTransaction())
	}
}

function generateTransaction() {
	let transactionBlock = txTransModel
	
	transactionBlock.txHash= randomGenerate("string", 32)
	transactionBlock.TxReceiptStatus = 'pending'
	transactionBlock.BlockHeight = blockHeight
	transactionBlock.TimeStamp = new Date().getTime();
	transactionBlock.SellerAddress = randomGenerate("string", 32)
	transactionBlock.BuyerAddress = randomGenerate("string", 32)
	//transactionBlock.ShareHash = randomGenerate("string", 32)
	//transactionBlock.ShareTimeStamp = randomGenerate("string", 32)
	
	transactionBlock.ProductInfo = {}
	transactionBlock.ProductInfo.Name = randomGenerate("string", 6)
	transactionBlock.ProductInfo.Category = randomGenerate("number", 10)
	transactionBlock.ProductInfo.Brand = randomGenerate("string", 6)
	transactionBlock.ProductInfo.Manifactory = randomGenerate("string", 6)
	transactionBlock.ProductInfo.Seller = randomGenerate("string", 6)
	transactionBlock.ProductInfo.Buyer = randomGenerate("string", 6)
	//transactionBlock.ProductInfo.SKU = randomGenerate("string", 6)
	//transactionBlock.ProductInfo.EAN = randomGenerate("string", 6)
	transactionBlock.ProductInfo.Price = randomGenerate("number", 6)
	transactionBlock.ProductInfo.Currency = randomGenerate("number", 6)
	transactionBlock.ProductInfo.Description = randomGenerate("string", 20)
	
	//transactionBlock.SharedTimes = new Date().getTime();
	transactionBlock.Status = "pending"
	transactionBlock.InputData = randomGenerate("string", 20)

	return transactionBlock
}

function randomGenerate(type, length){
	if(type == "number") {
		return Math.floor(Math.random() * Math.floor(length));
	} else if(type == "string") {
		return getRandomString(length)
	}
}

function getRandomString(length){
	var quotient = Math.floor(length/11);
	var remainder = length % 11;
	var result = []

	for(var i = 0; i < quotient; i++){
		result.push(Math.random().toString(36).substring(2, 13))
	}
	
	result.push(Math.random().toString(36).substring(2, remainder + 2))
	
	while(result.join("").length < length){
		result.push(verifyRandomStringLength(result.join(""), length))
	}
	
	return result.join("")
}

function verifyRandomStringLength(string, length){
	if(string.length < length){
		diff = length - string.length
		return getRandomString(diff)
	}
}