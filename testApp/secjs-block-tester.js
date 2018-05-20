const secjs_block = require('../utils/secjs-transaction-block');
const secjs_blockchain = require('../utils/secjs-transaction-blockchain');
//const secjs_tx_pool = require('../utils/secjs-transaction-blockchain');
const secjs_tx_pool = require('../utils/secjs-transaction-pool');
const generate = require('../utils/secjs-random-generate');
const hash_generate = require('../utils/secjs-hash');
let txTransModel = require('../model/transactionchain-trans-model');



let txpool_config = {
    poolname: 'transactionpool'
}
let block_config = {
    blockversion: '0.0.1_201805'
}
let blockchain_config = {
    blockchain_version: '0.0.1_201805'
}
let block = new secjs_block(block_config);
let blockchain = new secjs_blockchain('',blockchain_config);
let txpool = new secjs_tx_pool(txpool_config);
let hash = new hash_generate('sha256');


//create a simulation of transaction
txTransModel.TxHash = hash.hash('transaction 1');
console.log(`generate hash of transaction ${txTransModel.TxHash}`);
txTransModel.BlockHeight = generate.randomGenerate('number', 5);
console.log(`generate height of transaction ${txTransModel.BlockHeight}`);
txTransModel.TimeStamp = `20180520115100`;
txTransModel.BuyerAddress = `Template Buyer Adress`;
txTransModel.InputData = `My Transaction`;
txTransModel.SellerAddress = `Template Seller Adress`;
txTransModel.SharedTimes = `201805211121`;
txTransModel.ShareHash = hash.hash('buyer hash');
txTransModel.Status = `shared`;
txTransModel.TxReceiptStatus = `success`;
txTransModel.Version = `0.0.1`;

//add transaction into transaction pool
txpool.addTxIntoPool(txTransModel);

//gernate a transaction chain block
block.generateBlock(txpool, blockchain);
blockchain.addBlockToChain(block);




