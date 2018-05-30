let secjsHash = require('../src/secjs-hash')
let expect = require('chai').expect

describe('secjsHash', () => {
  describe('supported hash algorithm test', () => {
    it('should not throw an error if input is supported hash algorighms', () => {
      expect(() => { new secjsHash('md5') }).to.not.throw('Expected "md5" hash algorithm is supported ')
      expect(() => { new secjsHash('sha1') }).to.not.throw('Expected "sha1" hash algorithm is supported ')
      expect(() => { new secjsHash('sha256') }).to.not.throw('Expected "sha256" hash algorithm is supported ')
      expect(() => { new secjsHash('sha512') }).to.not.throw('Expected "sha512" hash algorithm is supported ')
      expect(() => { new secjsHash('ripemd160') }).to.not.throw('Expected "ripemd160" hash algorithm is supported ')
    })

    it('should throw an error if input is unsupported/unexpected', () => {
      expect(() => { new secjsHash('') }).to.throw('Expected a supported hash algorithm')
      expect(() => { new secjsHash('123') }).to.throw('Expected a supported hash algorithm')
      expect(() => { new secjsHash(1) }).to.throw('Expected a supported hash algorithm')
      expect(() => { new secjsHash(['md5']) }).to.throw('Expected a supported hash algorithm')
      expect(() => { new secjsHash(['abc']) }).to.throw('Expected a supported hash algorithm')
    })
  })

  describe('hash calculation result correctness test', () => {
    let testString1 = 'abcdefghijklmnopqrstuvwxyz'
    let testString2 = ''

    // online hash calculation: http://www.sha1-online.com/
    it('md5 calculation result test', () => {
      let hash = new secjsHash('md5')
      let hashResult = hash.hash(testString1)
      expect(hashResult.toLowerCase()).to.equal('c3fcd3d76192e4007dfb496cca67e13b')
      hashResult = hash.hash(testString2)
      expect(hashResult.toLowerCase()).to.equal('d41d8cd98f00b204e9800998ecf8427e')
    })
    it('sha1 calculation result test', () => {
      let hash = new secjsHash('sha1')
      let hashResult = hash.hash(testString1)
      expect(hashResult.toLowerCase()).to.equal('32d10c7b8cf96570ca04ce37f2a19d84240d3a89')
      hashResult = hash.hash(testString2)
      expect(hashResult.toLowerCase()).to.equal('da39a3ee5e6b4b0d3255bfef95601890afd80709')
    })
    it('sha256 calculation result test', () => {
      let hash = new secjsHash('sha256')
      let hashResult = hash.hash(testString1)
      expect(hashResult.toLowerCase()).to.equal('71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73')
      hashResult = hash.hash(testString2)
      expect(hashResult.toLowerCase()).to.equal('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    })
    it('sha512 calculation result test', () => {
      let hash = new secjsHash('sha512')
      let hashResult = hash.hash(testString1)
      expect(hashResult.toLowerCase()).to.equal('4dbff86cc2ca1bae1e16468a05cb9881c97f1753bce3619034898faa1aabe429955a1bf8ec483d7421fe3c1646613a59ed5441fb0f321389f77f48a879c7b1f1')
      hashResult = hash.hash(testString2)
      expect(hashResult.toLowerCase()).to.equal('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e')
    })
    it('ripemd160 calculation result test', () => {
      let hash = new secjsHash('ripemd160')
      let hashResult = hash.hash(testString1)
      expect(hashResult.toLowerCase()).to.equal('f71c27109c692c1b56bbdceb5b9d2865b3708dbc')
      hashResult = hash.hash(testString2)
      expect(hashResult.toLowerCase()).to.equal('9c1185a5c5e9fc54612808977ee8f548b2258d31')
    })
  })

  describe('hash algorithm length correctness test', () => {
    it('return lenght of md5', () => {
      let hash = new secjsHash('md5')
      let hashlength = hash.getHashLength()
      expect(hashlength).to.equal(32)
    })
    it('return lenght of sha1', () => {
      let hash = new secjsHash('sha1')
      let hashlength = hash.getHashLength()
      expect(hashlength).to.equal(40)
    })
    it('return lenght of sha256', () => {
      let hash = new secjsHash('sha256')
      let hashlength = hash.getHashLength()
      expect(hashlength).to.equal(64)
    })
    it('return lenght of sha512', () => {
      let hash = new secjsHash('sha512')
      let hashlength = hash.getHashLength()
      expect(hashlength).to.equal(128)
    })
    it('return lenght of ripemd160', () => {
      let hash = new secjsHash('ripemd160')
      let hashlength = hash.getHashLength()
      expect(hashlength).to.equal(40)
    })
  })
})
