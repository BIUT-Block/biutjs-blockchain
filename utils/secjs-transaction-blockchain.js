const fs = require('fs')
//const txTransModel = require('../model/transactionchain-trans-model')

class SECTransactionBlockChain{
    /**
     * create a transaction chain block chain with config
     * @param {*} blockchain, config
     * 
     */
    constructor(blockchain, config){
        this.txBlockChain = {}
        if((typeof blockchain !== 'undefined') && (blockchain != '')){
            this.txBlockChain = JSON.parse(blockchain)
        }
        this.config = config
    }

    /**
     * push a block at the bottom of the blockchain
     * @param {*} block
     *  
     */
    addBlockToChain(block){
        //let blockHeight = this.getCurrentHeight()
		
        //if(blockHeight = block.Height + 1){
        this.txBlockChain[block.Height] = block
        //}
        //else{
        //do something
        //}
    }
	
    /**
     * store the blockchain to a local file
     * @param {*} file
     *  
     */
    writeBlockChainToFile(file){
        fs.writeFile(file, JSON.stringify(this.txBlockChain), (err) => { throw err })
    }
	
    /**
     * return last block's height
     * @param {*} None
     *  
     */
    getCurrentHeight(){
        let blockHeight = 0
        Object.keys(this.txBlockChain).forEach(function(key){
            if(key > parseInt(blockHeight)){
                blockHeight = key
            }
        })
        return blockHeight
    }
	
    /**
     * return last block's hash value
     * @param {*} None
     *  
     */
    getLastBlockHash(){
        let blockHeight = this.getCurrentHeight()
        return this.txBlockChain[blockHeight].Hash
    }
	
    /**
     * return last block's timestamp
     * @param {*} None
     *  
     */
    getLastBlockTimeStamp(){
        let blockHeight = this.getCurrentHeight()
        return this.txBlockChain[blockHeight].TimeStamp
    }

}

module.exports = SECTransactionBlockChain