const txBlockModel = require('../model/transactionchain-block-model')
//const powCal = require('pow-calculation')
const SECHash = require('./secjs-hash.js')



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



class SECTransactionBlock{
	/**
     * create a transaction chain block with config
     * @param {*} config
     * 
     */
    constructor(config){
		this.config = config
		this.transactions = []
		this.block = txBlockModel;
    }

	/**
     * generate a transaction chain block
     * @param {*} txPool, txBlockChain
     *  
     */
	generateBlock(txPool, txBlockChain){
		this.collectTxFromPool(txPool)
		this.fillInBlockInfo(txBlockChain)
	}

	/**
     * collect transactions from transaction pool
     * @param {*} txPool
     *  
     */
	collectTxFromPool(txPool){
		let txBuffer = txPool.getAllTxFromPool()
		txBuffer.forEach((currTx) => {
			if(this.verifyTransaction(currTx)) {
				this.transactions.push(currTx)
			} //else{
				//report???
			//}
		});
	}
	
	/**
     * assign value to block header
     * @param {*} txBlockChain
     *  
     */
	fillInBlockInfo(txBlockChain){
		let hashalgo = "sha256"
		let secjs_hash = new SECHash(hashalgo)
		
		this.block.Height = randomGenerate("number", 10000)					//txBlockChain.currentHeight + 1
		this.block.TimeStamp = new Date().getTime();
		this.block.Transactions = this.transactions
		this.block.Parent_Hash = randomGenerate("string", 32)				//txBlockChain.lastBlockHash
		this.block.Mined_By = randomGenerate("string", 32)					//this.config.userAddr
		this.block.Block_Reward = 10 		//TBD
		this.block.Extra_Data = ""			//Empty?
		
		this.block.Size = JSON.stringify(this.block).length + 2 * secjs_hash.getHashLength()
		this.block.Hash = secjs_hash.hash(JSON.stringify(this.block))
		this.block.Nonce = randomGenerate("string", 32)						//powCal.getNonce(this.block)
	}
	

	/**
     * verify that the transaction is legal 
     * @param {*} transaction
     *  
     */
	verifyTransaction(transaction){
		//do nothing, will be implemented in the future
		return true
	}
	
	
}

module.exports = SECTransactionBlock;