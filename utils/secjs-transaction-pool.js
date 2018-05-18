const txBlockChain = require('./secjs-transaction-blockchain');
const tokenBlockChain = require('./secjs-token-blockchain');

class TransactionPool {
    /**
     * create a transaction pool with config, such as transaction pool of token chain or transaction chain
     * @param {*} config
     * 
     */
    constructor(config, isTxBlockChain){
        this.config = config;
        this.txBuffer = [];
        this.blockChainHashBuffer = {
            blockHashes: [],
            firstTimeUpdate: true,
            updateTime: ''
        };
		if(isTxBlockChain){
			this.blockChain = new txBlockChain();
		} else{
			this.blockChain = new tokenBlockChain();
		}
        
    }

    /**
     * save the transaction into local transaction pool
     * @param {*} transaction
     *  
     */
    addTxIntoPool(transaction){
        this.txBuffer.push(JSON.stringify(transaction));
    }

    /**
     * upate the block hash array
     * this blockChainHashBuffer is for checking the transaction in transaction pool, just compare the TxHash
     * @param {*} blockChain 
     */
    updateBlockHashArray(blockChain){
        let timeStampOfLastBlock = this.blockChain.getLastBlockTimeStamp();

        if(this.blockChainHashBuffer.firstTimeUpdate){
            blockChain.foreach((block) => {
                this.blockChainHashBuffer.blockHashes.add(block.TxHash);
                this.blockChainHashBuffer.firstTimeUpdate = false;
                this.blockChainHashBuffer.updateTime = new Date().getTime();
            });
        } else {
            if(this.blockChainHashBuffer.updateTime < timeStampOfLastBlock){
                let partBlockChain = blockChain.filter((block) => {
                    return block.TimeStamp >= timeStampOfLastBlock
                });
                this.blockChainHashBuffer.blockHashes.concat(partBlockChain.TxHash);
                this.blockChainHashBuffer.updateTime = new Date().getTime();
            } else {
                //do nothing
            }
        }
    }

    /**
     * remove transactions in transaction pool, if they are already upload to blockchain
     */
    compareTxWithHashTable(){
        let tempBuffer = [];
        this.txBuffer.foreach((transaction) => {
            this.blockChainHashBuffer.blockHashes.foreach((hash) => {
                if(transaction.TxHash !== hash){
                    tempBuffer.add(transaction.TxHash);
                }
            });
        });
        this.txBuffer = tempBuffer;
    }


    /**
     * to update the local transaction pool with transactions from other peers
     * @param {*} txFromOtherPeer 
     * 
     */
    addTxFromOtherPeerIntoPool(txFromOtherPeer){
        txFromOtherPeer.foreach((tx)=>{
            this.txBuffer.foreach((localTx)=> {
                if(tx.TxHash !== localTx.TxHash){
                    this.txBuffer.add(tx);
                    break;
                }
            });
        });
    }

    /**
     * get transaction status: pending, success, error
     * @param {*} transaction 
     */
    getTxStatus(transaction){
        return this.transaction.TxReceiptStatus;
    }


    /**
     * return all transaction from pool
     */
    getAllTxFromPool(){
        return this.txBuffer;
    }
    
}

module.exports = TransactionPool;