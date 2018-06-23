# SECJS-Block
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This libary contains the definition of block and block chain model. Use this libary can get the information of the block and blockchain information.
And also generate the genesis block.

### API of token blockchain

#### `new secjsTokenBlock()`
Instance object of block of token chain.
- `config`: the file path to save the token information

#### `secjsTokenBlock.generateBlock(tokenPool, tokenBlockChain)`
Get the block information from transaction pool and write the information to block object.
- `tokenPool`: Instance of token transaction pool
- `tokenBlockChain`: Instance of token-blockchain 

#### `secjsTokenBlock.getBlock()`
Return the block instance.

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