# SECJS-Blockchain
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This libary contains the definition of block and block chain model. Use this libary can get the information of the block and blockchain information.
And also generate the genesis block.

### API of token blockchain

#### `new secjsTokenBlock()`
Instance object of block of token chain.
- `config`: the file path to save the token information

#### `secjsTokenBlock.getBlock()`
Return the block instance.

### `secjsTokenBlock.putGenesis(genesis, cb)`
Put token chain genesis block into database.
- `genesis`: json object of genesis block
- `cb`: callback function

### `secjsTokenBlock.getBlocksWithHashFromDB(hashArray, cb)`
Get blocks from array of blockhash
- `hashArray`: an array of block hash
- `cb`: callback function

### `secjsTokenBlock.putBlockToDB(block, cb)`
- `block`: json object of block
- `cb`: callback function

### `secjsTokenBlock.getBlockChainFromDB(minHeight, maxHeight, cb)`
- `minHeight`: height of block begin to read
- `maxHeight`: height of block end to read
- `cb`: callback function

### `secjsTokenBlock.getGenesis()`
Get genesis block direct from buffer

### `secjsTokenBlock.getLastBlock()`
Get last block direct from buffer

#### `secjsTokenBlock.verifyTransaction()`
Verification the transaction.

### `new secjsTokenBlockChain()`
- `config`: Token Block chain

### `secjsTokenBlockChain.init(callback)`
This function check the existence of the file to save the block chain information. If the file is not existed, a new file will be created.
Otherwise the block chain will be loaded from the file. 
- `callback`: callback function with parameter tocken blockchain

### `secjsTokenBlockChain.getBlockChain()`
Return the block chain instance

### `secjsTokenBlockChain.generateGenesisBlockChain()`
Create the genesis blockchain

### API of transaction block chain
Funcionality simlar as token blockchain and token block

#### License
MIT