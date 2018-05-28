<a name="TransactionPool"></a>

## TransactionPool
**Kind**: global class  

* [TransactionPool](#TransactionPool)
    * [new TransactionPool(config)](#new_TransactionPool_new)
    * [.addTxIntoPool(transaction)](#TransactionPool+addTxIntoPool)
    * [.updateBlockHashArray(blockChain)](#TransactionPool+updateBlockHashArray)
    * [.compareTxWithHashTable()](#TransactionPool+compareTxWithHashTable)
    * [.addTxFromOtherPeerIntoPool(txFromOtherPeer)](#TransactionPool+addTxFromOtherPeerIntoPool)
    * [.getTxStatus(transaction)](#TransactionPool+getTxStatus)
    * [.getAllTxFromPool()](#TransactionPool+getAllTxFromPool)

<a name="new_TransactionPool_new"></a>

### new TransactionPool(config)
create a transaction pool with config, such as transaction pool of token chain or transaction chain


| Param | Type |
| --- | --- |
| config | Json Object | 

<a name="TransactionPool+addTxIntoPool"></a>

### transactionPool.addTxIntoPool(transaction)
save the transaction into local transaction pool

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type |
| --- | --- |
| transaction | ref of transaction | 

<a name="TransactionPool+updateBlockHashArray"></a>

### transactionPool.updateBlockHashArray(blockChain)
upate the block hash array
this blockChainHashBuffer is for checking the transaction in transaction pool, just compare the TxHash

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type |
| --- | --- |
| blockChain | ref of blockChain | 

<a name="TransactionPool+compareTxWithHashTable"></a>

### transactionPool.compareTxWithHashTable()
remove transactions in transaction pool, if they are already upload to blockchain

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  
<a name="TransactionPool+addTxFromOtherPeerIntoPool"></a>

### transactionPool.addTxFromOtherPeerIntoPool(txFromOtherPeer)
to update the local transaction pool with transactions from other peers

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type |
| --- | --- |
| txFromOtherPeer | object of transaction | 

<a name="TransactionPool+getTxStatus"></a>

### transactionPool.getTxStatus(transaction)
get transaction status: pending, success, error

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  

| Param | Type |
| --- | --- |
| transaction | object of tranaction | 

<a name="TransactionPool+getAllTxFromPool"></a>

### transactionPool.getAllTxFromPool()
return all transaction from pool

**Kind**: instance method of [<code>TransactionPool</code>](#TransactionPool)  