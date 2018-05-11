const txPoolModel = require('../model/transaction-pool-model');
const blockChain = require('../model/secjs-blockchain');

class TransactionPool {
    /**
     * create a transaction pool with config, such as transaction pool of token chain or transaction chain
     * @param {*} config
     * 
     */
    constructor(config){
        this.config = config;
        this.txBuffer = [];
        this.blockChainBuffer = {
            blockHashes: [],
            firstTimeUpdate: true,
            updateTime: ''
        };
        this.blockChain = new blockChain();
    }

    /**
     * save the transaction into local transaction pool
     * @param {*} transaction
     *  
     */
    addTxIntoPool(transaction){
        this.txBuffer.add(transaction);
    }

    /**
     * upate the block hash array
     * this blockChainBuffer is for checking the transaction in transaction pool, just compare the TxHash
     * @param {*} blockChain 
     */
    updateBlockHashArray(blockChain){
        let timeStampOfLastBlock = this.blockChain.getLastTimeStampOfBlocks();

        if(this.blockChainBuffer.firstTimeUpdate){
            blockChain.foreach((block) => {
                blockChainBuffer.blockHashes.add(block.TxHash);
                blockChainBuffer.firstTimeUpdate = false;
                blockChainBuffer.updateTime = new Date().getTime();
            });
        } else {
            if(this.blockChainBuffer.updateTime < timeStampOfLastBlock){
                let partBlockChain = blockChain.filter((block) => {
                    return block.TimeStamp >= timeStampOfLastBlock
                });
                this.blockChainBuffer.blockHashes.concat(partBlockChain.TxHash);
                updateTime = new Date().getTime();
            } else {
                //do nothing
            }
        }
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
    
    removeTxFromPool(transaction){
        this.txBuffer = this.txBuffer.filter((transactions) => {
            if (transactions.TxHash !== transaction.TxHash){
                transactions.TxReceiptStatus = 'success';             
            } else {
                transactions.TxReceiptStatus = 'pending';
            }
            return transactions;
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
        return JSON.stringify(this.txBuffer);
    }
    
}

module.exports = TransactionPool;