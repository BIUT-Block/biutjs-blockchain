const fs = require('fs')
const txTransModel = require('../model/transactionchain-trans-model')

class SECTransactionBlockChain{
	/**
     * create a transaction chain block chain with config
     * @param {*} file, config
     * 
     */
    constructor(file, config){
		this.txBlockChain = []
		this.lastBlock = txTransModel
		
		if(file){
			fs.readFile(file, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				this.txBlockChain.push(data)
			})
			
			this.lastBlock = this.txBlockChain[this.txBlockChain.length - 1]
		}
    }

	/**
     * push a block at the bottom of the blockchain
     * @param {*} block
     *  
     */
	addBlockToChain(block){
		this.txBlockChain.push(JSON.stringify(block))
	}
	
	/**
     * store the blockchain to a local file
     * @param {*} file
     *  
     */
	writeBlockChainToFile(file){
		fs.writeFile(file, JSON.stringify(this.txBlockChain))
	}
	
	/**
     * return last block's height
     * @param {*} None
     *  
     */
	getCurrentHeight(){
		return this.lastBlock.Height
	}
	
	/**
     * return last block's hash value
     * @param {*} None
     *  
     */
	getLastBlockHash(){
		return this.lastBlock.Hash
	}
	
	/**
     * return last block's timestamp
     * @param {*} None
     *  
     */
	getLastBlockTimeStamp(){
		return this.lastBlock.TimeStamp
	}

}

module.exports = SECTransactionBlockChain;