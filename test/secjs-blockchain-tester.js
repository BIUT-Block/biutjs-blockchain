/* global describe it beforeEach after */
const SECDataHandler = require('@sec-block/secjs-datahandler')
const dbconfig = {
  DBPath: process.cwd() + '/data',
  ID: 'TestID'
}
const TxBlockchainDataHandler = new SECDataHandler.TxBlockChainDB(dbconfig)
const TokenBlockchainDataHandler = new SECDataHandler.TokenBlockChainDB(dbconfig)
const _SECUtils = require('@sec-block/secjs-util')
const fs = require('fs-extra')
const mockData = require('./mock-data')
const expect = require('chai').expect
const assert = require('chai').assert
const should = require('chai').should()
const SECBlockchain = require('../src/index')

describe('Block Tester', () => {
  describe('SEC Token Blockchain', () => {
    let tokenBlockChain
    beforeEach(() => {
      tokenBlockChain = new SECBlockchain.SECTokenBlockChain(TokenBlockchainDataHandler)
    })

    after(() => {
      fs.remove(process.cwd() + '/data/')
    })

    it('instance', () => {
      assert.typeOf(tokenBlockChain, 'Object')
    })

    it('instance of util lib', () => {
      expect(tokenBlockChain.util).to.instanceof(_SECUtils)
    })

    it('init Token BlockChain Object', () => {
      tokenBlockChain.init(() => {
        should.exist(tokenBlockChain.getBlockChain())
        assert.equal(tokenBlockChain.getGenesisBlockHash(), 'be44ec287a0e3fb7b8a1ad0432b7f9004e399826a34b4cb9fffe17abddfccf5e')
        assert.equal(tokenBlockChain.getGenesisBlockDifficulty(), 1)
        assert.equal(tokenBlockChain.getCurrentHeight(), 0)
      })
    })

    it('Add Block to Token BlockChain', () => {
      tokenBlockChain.init(() => {
        tokenBlockChain.putBlockToDB(mockData.tokenBlock, () => {
          assert.equal(tokenBlockChain.getCurrentHeight(), 1)
          assert.equal(tokenBlockChain.getLastBlockHash(), mockData.tokenBlock.Hash)
          assert.equal(tokenBlockChain.getLastBlockDifficulty(), mockData.tokenBlock.Difficulty)
          assert.equal(tokenBlockChain.getLastBlockTimeStamp(), mockData.tokenBlock.TimeStamp)
          assert.equal(tokenBlockChain.getLastBlock(), mockData.tokenBlock)
        })
      })
    })
  })

  describe('SEC Transaction Blockchain', () => {
    let transactionBlockChain
    beforeEach(() => {
      transactionBlockChain = new SECBlockchain.SECTransactionBlockChain(TxBlockchainDataHandler)
    })

    after(() => {
      fs.remove(process.cwd() + '/data/')
    })

    it('instance', () => {
      assert.typeOf(transactionBlockChain, 'Object')
    })

    it('instance of util lib', () => {
      expect(transactionBlockChain.util).to.instanceof(_SECUtils)
    })

    it('init Transaction BlockChain Object', () => {
      transactionBlockChain.init(() => {
        should.exist(transactionBlockChain.getBlockChain())
        assert.equal(transactionBlockChain.getGenesisBlockHash(), 'be44ec287a0e3fb7b8a1ad0432b7f9004e399826a34b4cb9fffe17abddfccf5e')
        assert.equal(transactionBlockChain.getGenesisBlockDifficulty(), 1)
        assert.equal(transactionBlockChain.getCurrentHeight(), 0)
      })
    })

    it('Add Block to Transaction BlockChain', () => {
      transactionBlockChain.init(() => {
        transactionBlockChain.putBlockToDB(mockData.transactionBlock, () => {
          assert.equal(transactionBlockChain.getCurrentHeight(), 1)
          assert.equal(transactionBlockChain.getLastBlockHash(), mockData.transactionBlock.Hash)
          assert.equal(transactionBlockChain.getLastBlockDifficulty(), mockData.transactionBlock.Difficulty)
          assert.equal(transactionBlockChain.getLastBlockTimeStamp(), mockData.transactionBlock.TimeStamp)
          assert.equal(transactionBlockChain.getLastBlock(), mockData.transactionBlock)
        })
      })
    })
  })
})
