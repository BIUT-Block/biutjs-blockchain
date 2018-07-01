const SECjsTokenChain = require('../src/secjs-token-blockchain')
const SECjsTxChain = require('../src/secjs-transaction-blockchain')
const SECUtil = require('@sec-block/secjs-util')
const path = require('path')
const fs = require('fs')
const expect = require('chai').expect
const assert = require('chai').assert
const should = require('chai').should()

describe('Blockchain tester', () => {
  describe('SECjs Token blockchain', () => {
    let tokenChain
    beforeEach(() => {
      tokenChain = new SECjsTokenChain()
    })

    it('instance', () => {
      assert.typeOf(tokenChain, 'Object')
    })
    it('file path', () => {
      expect(tokenChain.config.filePath).to.contains('secjs-block/data/tokenchain.json')
    })
    it('instance of util lib', () => {
      expect(tokenChain.util).to.instanceof(SECUtil)
    })
    it('create genesis block', () => {
      let genesisBlock = tokenChain._generateGenesisBlock()
      expect(genesisBlock).to.instanceof(Object)
      assert.equal(genesisBlock.Height, 0)
      assert.equal(genesisBlock.Mined_By, 'SEC')
      assert.equal(genesisBlock.Difficulty, 1)
      assert.equal(genesisBlock.Total_Difficulty, 1)
      assert.equal(genesisBlock.Extra_Data, 'SEC Hello World')
    })
    it('read the block chain file correct', () => {
      tokenChain.config.filePath = path.join(__dirname, './test-files/tokenchain.json')
      tokenChain._readBlockChainFile((data) => {
        expect(data.toString().length).to.not.equal(0)
      })
    })
    it('init block chain with existed File', () => {
      tokenChain.config.filePath = path.join(__dirname, './test-files/tokenchain.json')
      tokenChain.init((blockChain) => {
        should.exist(blockChain[1])
        should.exist(blockChain[1])
        should.exist(blockChain[1])
      })
    })
    it('init block chain without existed File', () => {
      tokenChain.config.filePath = path.join(__dirname, './test-files/genesis.json')
      tokenChain.init((blockChain) => {
        should.exist(blockChain[0])
        expect(blockChain[0].Parent_Hash).to.equal('Genesis')
        fs.unlinkSync(path.join(__dirname, './test-files/genesis.json'))
      })
    })
  })

  describe('SECjs Transaction Chain', () => {
    let txChain
    beforeEach(() => {
      txChain = new SECjsTxChain()
    })
    it('create genesis block', () => {
      let genesisBlock = txChain._generateGenesisBlock()
      assert.equal(genesisBlock.Height, 0)
      assert.equal(genesisBlock.Mined_By, 'SEC')
      assert.equal(genesisBlock.Extra_Data, 'SEC Hello World')
    })
    it('read block chain file correct', () => {
      txChain.config.filePath = path.join(__dirname, './test-files/txchain.json')
      txChain._readBlockChainFile((blockChain) => {
        expect(blockChain[1]).to.exist
        expect(blockChain[1]).to.exist
      })
    })
    it('init block chain with existed File', () => {
      txChain.config.filePath = path.join(__dirname, './test-files/txchain.json')
      txChain.init((blockChain) => {
        should.exist(blockChain[1])
        should.exist(blockChain[1])
        should.exist(blockChain[1])
      })
    })
    it('init block chain without existed File', () => {
      txChain.config.filePath = path.join(__dirname, './test-files/genesis.json')
      txChain.init((blockChain) => {
        should.exist(blockChain[0])
        expect(blockChain[0].Parent_Hash).to.equal('Genesis')
        fs.unlinkSync(path.join(__dirname, './test-files/genesis.json'))
      })
    })
  })
})
