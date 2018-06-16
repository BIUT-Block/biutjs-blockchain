<a name="SECTransactionBlock"></a>

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard) 

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)]

## SECTransactionBlock

Class of transaction block. Generate block and block header
Get transaction information from transaction pool.

* [SECTransactionBlock](#SECTransactionBlock)
    * [new SECTransactionBlock(config)](#new_SECTransactionBlock_new)
    * [.generateBlock(txPool,)](#SECTransactionBlock+generateBlock)
    * [.collectTxFromPool(txPool)](#SECTransactionBlock+collectTxFromPool)
    * [.fillInBlockInfo(txBlockChain)](#SECTransactionBlock+fillInBlockInfo)
    * [.verifyTransaction(transaction)](#SECTransactionBlock+verifyTransaction)

<a name="new_SECTransactionBlock_new"></a>

### new SECTransactionBlock(config)
create a transaction chain block with config


| Param | Type |
| --- | --- |
| config | object of config | 

<a name="SECTransactionBlock+generateBlock"></a>

### secTransactionBlock.generateBlock(txPool,)
generate a transaction chain block

**Kind**: instance method of [<code>SECTransactionBlock</code>](#SECTransactionBlock)  

| Param | Type | Description |
| --- | --- | --- |
| txPool |  | 
| txBlockChain | instance of transaction block chain |

<a name="SECTransactionBlock+collectTxFromPool"></a>

### secTransactionBlock.collectTxFromPool(txPool)
collect transactions from transaction pool

**Kind**: instance method of [<code>SECTransactionBlock</code>](#SECTransactionBlock)  

| Param | Type |
| --- | --- |
| txPool | <code>\*</code> | 

<a name="SECTransactionBlock+fillInBlockInfo"></a>

### secTransactionBlock.fillInBlockInfo(txBlockChain)
assign value to block header

**Kind**: instance method of [<code>SECTransactionBlock</code>](#SECTransactionBlock)  

| Param | Type |
| --- | --- |
| txBlockChain | <code>\*</code> | 

<a name="SECTransactionBlock+verifyTransaction"></a>

### secTransactionBlock.verifyTransaction(transaction)
verify that the transaction is legal

**Kind**: instance method of [<code>SECTransactionBlock</code>](#SECTransactionBlock)  

| Param | Type |
| --- | --- |
| transaction | <code>\*</code> | 

<a name="SECTransactionBlockChain"></a>

## SECTransactionBlockChain

Class of transaction chain block chain 

* [SECTransactionBlockChain](#SECTransactionBlockChain)
    * [new SECTransactionBlockChain(blockchain,)](#new_SECTransactionBlockChain_new)
    * [.addBlockToChain(block)](#SECTransactionBlockChain+addBlockToChain)
    * [.writeBlockChainToFile(file)](#SECTransactionBlockChain+writeBlockChainToFile)
    * [.getCurrentHeight(None)](#SECTransactionBlockChain+getCurrentHeight)
    * [.getLastBlockHash(None)](#SECTransactionBlockChain+getLastBlockHash)
    * [.getLastBlockTimeStamp(None)](#SECTransactionBlockChain+getLastBlockTimeStamp)

<a name="new_SECTransactionBlockChain_new"></a>

### new SECTransactionBlockChain(blockchain,)
create a transaction chain block chain with config


| Param | Type |
| --- | --- | --- |
| blockchain| instance of blockchain | 
| config | config object |

<a name="SECTransactionBlockChain+addBlockToChain"></a>

### secTransactionBlockChain.addBlockToChain(block)
push a block at the bottom of the blockchain

**Kind**: instance method of [<code>SECTransactionBlockChain</code>](#SECTransactionBlockChain)  

| Param | Type |
| --- | --- |
| block | instance of block | 

<a name="SECTransactionBlockChain+writeBlockChainToFile"></a>

### secTransactionBlockChain.writeBlockChainToFile(file)
store the blockchain to a local file

**Kind**: instance method of [<code>SECTransactionBlockChain</code>](#SECTransactionBlockChain)  

| Param | Type |
| --- | --- |
| file | save file path | 

<a name="SECTransactionBlockChain+getCurrentHeight"></a>

### secTransactionBlockChain.getCurrentHeight(None)
return last block's height

**Kind**: instance method of [<code>SECTransactionBlockChain</code>](#SECTransactionBlockChain)  

| Param | Type |
| --- | --- |
| None | <code>\*</code> | 

<a name="SECTransactionBlockChain+getLastBlockHash"></a>

### secTransactionBlockChain.getLastBlockHash(None)
return last block's hash value

**Kind**: instance method of [<code>SECTransactionBlockChain</code>](#SECTransactionBlockChain)  

| Param | Type |
| --- | --- |
| None | <code>\*</code> | 

<a name="SECTransactionBlockChain+getLastBlockTimeStamp"></a>

### secTransactionBlockChain.getLastBlockTimeStamp(None)
return last block's timestamp

**Kind**: instance method of [<code>SECTransactionBlockChain</code>](#SECTransactionBlockChain)  

| Param | Type |
| --- | --- |
| None | <code>\*</code> | 


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