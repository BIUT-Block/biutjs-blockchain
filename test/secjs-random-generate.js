const RandomGenerate = require('../src/secjs-random-generate')
const expect = require('chai').expect
// const describe = require('describe')

const test = new RandomGenerate()

describe('secjs-random-generate', () => {
  describe('random generation correctness test', () => {
    it('shoud generate a random string with defined length', () => {
      for (let i = 0; i < 100; i++) {
        let result = test.generateRandomData('string', i)
        expect(result.length).to.equal(i)
      }
    })

    it('shoud generate a random integer within defined range', () => {
      for (let i = 0; i < 1000; i = i + 10) {
        let result = test.generateRandomData('number', i)
        expect(result).to.be.within(0, i)
      }
    })
  })

  describe('random generation invalid input test', () => {
    it('throw an error when input "type" is invalid', () => {
      expect(() => { test.generateRandomData('sdasda', 10) }).to.throw('Wrong random generate data type')
      expect(() => { test.generateRandomData([123], 10) }).to.throw('Wrong random generate data type')
    })

    it('throw an error when input "length" is invalid', () => {
      expect(() => { test.generateRandomData('string', -1) }).to.throw('Input length is invalid')
      expect(() => { test.generateRandomData('number', -10) }).to.throw('Input length is invalid')
    })
  })
})

describe('randomGenerate() function test', () => {
  describe('generateRandomTxData() function test', () => {
    it('generateTxHash', () => {
      test.generateRandomTxData().generateTxHash(function (value) {
        expect(value).to.equal(f0887801b76b9223b3c73a60205b647f2652bb64d2d37630c30b4f39f907bc7)
      })
    })
    it('generateTimeStamp', () => {
      test.generateRandomTxData().generateTimeStamp(function (value) {
        expect(value).to.equal(1530641896147)
      })
    })
    it('generateAddress', () => {
      test.generateRandomTxData().generateSellerAddress(function (value) {
        expect(value).to.equal(LH7dxKNwiaBKwsDdURztzE56gj6ZYdC3u)
      })
    })
    it('BlockHeight', () => {
      test.generateRandomTxData().generateBlockHeight(function (value) {
        expect(value).to.equal(2)
      })
    })
    it('generateProductInfo', () => {
      test.generateRandomTxData().generateProductInfo(function (value) {
        expect(value).to.equal({ items: '{"Name":"559401398866","Category":"110502","Brand":"26683","Manufactory":"DELL China","Seller":"2616970884","Buyer":"18,185,61,169","SKU":"3656813854379","EAN":"5397063744596","Price":"1099","Currency":"RMB","Description":"Dell/戴尔 P2317H 23英寸显示器 窄边框 IPS高清液晶台式电脑屏"}' })
      })
    })
  })

  describe('generateRandomTokenData() function test', () => {
    it('generateTokenHash', () => {
      test.generateRandomTokenData().generateTxHash(function (value) {
        expect(value).to.equal(f0887801b76b9223b3c73a60205b647f2652bb64d2d37630c30b4f39f907bc7)
      })
    })
    it('generateTimeStamp', () => {
      test.generateRandomTokenData().generateTimeStamp(function (value) {
        expect(value).to.equal(1530641896147)
      })
    })
    it('generateAddress', () => {
      test.generateRandomTokenData().generateTxFrom(function (value) {
        expect(value).to.equal(LH7dxKNwiaBKwsDdURztzE56gj6ZYdC3u)
      })
    })
    it('BlockHeight', () => {
      test.generateRandomTokenData().generateBlockHeight(function (value) {
        expect(value).to.equal(2)
      })
    })
    it('generateGasLimit', () => {
      test.generateRandomTokenData().generateGasLimit(function (value) {
        expect(value).to.equal(3065)
      })
    })
  })
})
