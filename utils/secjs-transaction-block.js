const txBlockModel = require('../model/transactionchain-block-model')
const powCal = require('pow-calculation')
const hash = require('./hash.js')

class SECTransactionBlock{
    constructor(config){
		this.config = config
		this.transactions = []
		this.block = new txBlockModel();
    }

	generateBlock(txPool, txBlockChain){
		collectTxFromPool(txPool)
		fillInBlockInfo(txBlockChain)
	}

	collectTxFromPool(txPool){
		txBuffer = txPool.getAllTxFromPool()
		txBuffer.foreach((currTx) => {
			if(verifyTransaction(currTx)) {
				this.transactions.add(currTx)
			} else{
				//report???
			}
		});
	}
	
	fillInBlockInfo(txBlockChain){
		this.block.Height = txBlockChain.currentHeight + 1
		this.block.TimeStamp = new Date().getTime();
		this.block.Transactions = this.transactions
		this.block.Parent_Hash = txBlockChain.lastBlockHash
		this.block.Mined_By = this.config.userAddr
		this.block.Block_Reward = 10 		//TBD
		this.block.Extra_Data = ""			//Empty?
		
		this.block.Size = size(this.block) + 2*hash_length
		this.block.Hash = hash.hash("sha256", this.block)
		this.block.Nonce = powCal.getNonce(this.block)
	}

	verifyTransaction(){
		//do nothing, will be implemented in the future
		return true
	}
}

module.exports = SECTransactionBlock;