const _ = require('lodash')
const AccTreeDB = require('./secjs-accTree.js')
const SECUtils = require('@sec-block/secjs-util')
const SECTokenBlock = require('./secjs-token-block')

class SECTokenBlockChain {
  /**
   * create a token chain block chain with config
   * @param {SECDataHandler} SECDataHandler
   *
   */
  constructor (SECDataHandler) {
    if (!SECDataHandler) {
      throw new Error('Can not find SECDataHandler Instance')
    }
    this.SECDataHandler = SECDataHandler
    this.dbPath = this.SECDataHandler.getDBPath()

    this.tokenBlockChain = []
    this.tokenTx = {}
  }

  _updateTokenTxBuffer (block) {
    if (typeof block === 'string') {
      block = JSON.parse(block)
    }

    block = JSON.parse(JSON.stringify(block))
    block.Transactions.forEach((tx) => {
      if (typeof tx === 'string') {
        tx = JSON.parse(tx)
      }
      this.tokenTx[tx.TxHash] = [tx.TxFrom, tx.TxTo, parseFloat(tx.Value), parseFloat(tx.TxFee)]
    })
  }

  /**
   * generate genesis token block
   */
  _generateGenesisBlock () {
    let extraData = 'SEC Hello World'
    if (process.env.secTest) {
      extraData = 'SEC Test Network Genesis Block'
    }
    return new SECTokenBlock({
      Number: 0,
      ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
      LogsBloom: SECUtils.zeros(256).toString('hex'),
      MixHash: SECUtils.zeros(32).toString('hex'),
      StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
      TimeStamp: 1537300000,
      ParentHash: SECUtils.zeros(32).toString('hex'),
      Beneficiary: SECUtils.zeros(20).toString('hex'),
      Difficulty: '1',
      ExtraData: extraData,
      Nonce: SECUtils.zeros(8).toString('hex'),
      Transactions: []
    }).getBlock()
  }

  _rebuildAccTreeDB (callback) {
    // clear accTree db and write genesis block to the db
    this.accTree.clearDB((err) => {
      if (err) {
        throw err
      } else {
        // parse this.tokenBlockChain
        this.tokenBlockChain.forEach((block, index) => {
          if (typeof block === 'string') {
            this.tokenBlockChain[index] = JSON.parse(block)
          }
        })
        this.accTree.updateWithBlockChain(this.tokenBlockChain, callback)
      }
    })
  }

  _initAccTree (root = undefined, callback) {
    let config = {
      DBPath: this.dbPath,
      StateRoot: root
    }

    try {
      this.accTree = new AccTreeDB(config)
    } catch (err) {
      return callback(err)
    }

    this.accTree.checkRoot(root, (err, result) => {
      if (err) callback(err)
      else if (!result) {
        this._rebuildAccTreeDB(callback)
      }
    })
  }

  /**
   * Initialize the class token-blockchain
   * @param {callback} callback - The callback that handles the response.
   */
  init (callback) {
    this.SECDataHandler.isTokenBlockChainDBEmpty((err, isEmpty) => {
      if (err) throw new Error('Could not check db content')
      if (isEmpty) {
        let geneBlock = this._generateGenesisBlock()
        this.putBlockToDB(geneBlock, () => {
          let root = this.getGenesisBlock().StateRoot
          this._initAccTree(root, callback)
        })
      } else {
        this._getAllBlockChainFromDB(() => {
          let root = this.getLastBlock().StateRoot
          this._initAccTree(root, callback)
        })
      }
    })
  }

  /**
   * Put token block to db
   * @param {SECTokenBlock} block the block object in json formation
   * @param {callback} callback
   */
  putBlockToDB (_block, callback) {
    // write a new block to DB
    let block = JSON.parse(JSON.stringify(_block))

    // check parent hash
    if (block.Number !== 0) {
      let lastBlockHash = this.tokenBlockChain[block.Number - 1].Hash
      if (block.ParentHash !== lastBlockHash) {
        throw new Error(`Invalid Parent Hash: ${block.ParentHash}, which should be ${this.getLastBlockHash()}`)
      }
    }

    // parse block.Transactions
    block.Transactions.forEach((tx, index) => {
      if (typeof tx === 'string') {
        block.Transactions[index] = JSON.parse(tx)
      }
    })

    if (block.Number === this.tokenBlockChain.length) {
      this.tokenBlockChain[block.Number] = block
      this._updateTokenTxBuffer(block)
      this.SECDataHandler.writeTokenBlockToDB(block, (err) => {
        if (err) throw new Error('Something wrong with write Single TokenBlock To DB function')
        else {
          this.accTree.updateWithBlock(block, () => { callback() })
        }
      })
    } else if (block.Number < this.tokenBlockChain.length) {
      // overwrite forked blocks
      if (this.tokenBlockChain.filter(tokenBlock => (tokenBlock.Hash === block.Hash)).length === 0) {
        let overwrittenTxArray = []
        this.accTree.revertWithBlock(this.tokenBlockChain[block.Number], (err) => {
          if (err) throw new Error(err)
          else {
            this.tokenBlockChain[block.Number].Transactions.forEach((tx, index) => {
              if (typeof tx === 'string') {
                tx = JSON.parse(tx)
                this.tokenBlockChain[block.Number].Transactions[index] = tx
              }
              delete this.tokenTx[tx.TxHash]
              tx.TxReceiptStatus = 'pending'
              if (tx.TxFrom !== '0000000000000000000000000000000000000000') {
                overwrittenTxArray.push(tx)
              }
            })

            this.tokenBlockChain[block.Number] = block
            this._updateTokenTxBuffer(block)
            this.SECDataHandler.writeTokenBlockToDB(block, (err) => {
              if (err) throw new Error('Something wrong with write Single TokenBlock To DB function')

              _.remove(overwrittenTxArray, (tx) => {
                return tx.TxHash in this.tokenTx
              })

              this.accTree.updateWithBlock(block, () => { callback(overwrittenTxArray) })
            })
          }
        })
      }
    } else {
      throw new Error('Can not add token Block, token Block Number is false.')
    }
  }

  /**
   * get blockchain from cache
   */
  getBlockChain () {
    return this.tokenBlockChain
  }

  getTxBuffer () {
    return this.tokenTx
  }

  /**
   * get Token Block from db
   * @param {Array} hashArray
   * @param {function} callback
   */
  getBlocksWithHash (hashArray, callback) {
    this.SECDataHandler.getTokenBlockFromDB(hashArray, callback)
  }

  /**
   * get all blockchain data
   */
  _getAllBlockChainFromDB (callback) {
    this.SECDataHandler.getTokenBlockChainDB((err, blockchain) => {
      if (err) {
        throw new Error('Can not get whole token block chain data from database')
      } else {
        blockchain.forEach((block) => {
          this._updateTokenTxBuffer(block)
          this.tokenBlockChain[block.Number] = block
        })
        callback()
      }
    })
  }

  /**
   * get Token Chain from DB
   * @param {number} minHeight
   * @param {number} maxHeight
   * @param {function} callback
   */
  getBlockChainFromDB (minHeight, maxHeight, callback) {
    this.SECDataHandler.getTokenChain(minHeight, maxHeight, callback)
  }

  /**
   * return last block's height
   */
  getCurrentHeight () {
    return this.tokenBlockChain.length - 1
  }

  /**
   * get genius block from buffer
   */
  getGenesisBlock () {
    if (typeof this.tokenBlockChain[0] === 'string') {
      this.tokenBlockChain[0] = JSON.parse(this.tokenBlockChain[0])
    }
    return this.tokenBlockChain[0]
  }

  /**
   * get the dificulty of blockchain
   */
  getGenesisBlockDifficulty () {
    if (typeof this.tokenBlockChain[0] === 'string') {
      this.tokenBlockChain[0] = JSON.parse(this.tokenBlockChain[0])
    }
    return this.tokenBlockChain[0].Difficulty
  }

  /**
   * get the genesis block hash
   */
  getGenesisBlockHash () {
    if (typeof this.tokenBlockChain[0] === 'string') {
      this.tokenBlockChain[0] = JSON.parse(this.tokenBlockChain[0])
    }
    return this.tokenBlockChain[0].Hash
  }

  /**
   * get the second last block from buffer
   */
  getSecondLastBlock () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight() - 1] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight() - 1] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight() - 1])
    }
    return this.tokenBlockChain[this.getCurrentHeight() - 1]
  }

  /**
   * get last block from buffer
   */
  getLastBlock () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()]
  }

  /**
   * return last block's hash value
   */
  getLastBlockHash () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()].Hash
  }

  /**
   * return last block's timestamp
   */
  getLastBlockTimeStamp () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()].TimeStamp
  }

  /**
   * get the dificulty of the last blockchain
   */
  getLastBlockDifficulty () {
    if (typeof this.tokenBlockChain[this.getCurrentHeight()] === 'string') {
      this.tokenBlockChain[this.getCurrentHeight()] = JSON.parse(this.tokenBlockChain[this.getCurrentHeight()])
    }
    return this.tokenBlockChain[this.getCurrentHeight()].Difficulty
  }

  getHashList () {
    let hashList = []
    this.tokenBlockChain.forEach(block => {
      hashList.push({
        Number: block.Number,
        Hash: block.Hash
      })
    })
    return hashList
  }
}

module.exports = SECTokenBlockChain
