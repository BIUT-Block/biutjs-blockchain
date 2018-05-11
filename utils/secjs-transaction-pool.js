const txPoolModel = require('../model/transaction-pool-model');


class TransactionPool {
    /**
     * create a transaction pool with config, such as transaction pool of token chain or transaction chain
     * @param {*} config
     * 
     */
    constructor(config){
        this.config = config;
        this.txBuffer = [];
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
     * broadcast transaction pool to other peers
     */
    broadCastTxPool(){
        //broad cast to other peer transaction pool
    }

    /**
     * return all transaction from pool
     */
    getAllTxFromPool(){
        return JSON.stringify(this.txBuffer);
    }
    
}

module.exports = TransactionPool;