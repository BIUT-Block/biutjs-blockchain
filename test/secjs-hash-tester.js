let secjs_hash = require('../utils/secjs-hash')
let expect = require('chai').expect

describe('secjs_hash', () => {
    describe('create hash generate object', () => {
        it('should throw expection', () => {
            expect(() => {let object = new secjs_hash('')}).to.throw('Expected a supported hash algorithm')
        })

        it('create correct instance', () => {
            expect(() => {let object = new secjs_hash('')}).to.ok
        })
    })

    describe('generate hash', () => {
        it('generate hash randomly', () => {
            let secjs_hash_test = new secjs_hash('sha256')
            let generatedHashLength = secjs_hash_test.hash('hash tester').length
            expect(generatedHashLength).to.equal(64)
        })
    })

    describe('get lenght of generated hash', () => {
        it('return lenght of md5', () => {
            let secjs_hash_test = new secjs_hash('md5')
            let hashlength = secjs_hash_test.getHashLength()
            expect(hashlength).to.equal(16)
        })

        it('return lenght of sha1', () => {
            let secjs_hash_test = new secjs_hash('sha1');
            let hashlength = secjs_hash_test.getHashLength();
            expect(hashlength).to.equal(20);
        })

        it('return length of sha256', () => {
            let secjs_hash_test = new secjs_hash('sha256');
            let hashlength = secjs_hash_test.getHashLength();
            expect(hashlength).to.equal(32);
        })

        it('return length of sha512', () => {
            let secjs_hash_test = new secjs_hash('sha512');
            let hashlength = secjs_hash_test.getHashLength();
            expect(hashlength).to.equal(64);
        })

        it('return length of ripemd512', () => {
            let secjs_hash_test = new secjs_hash('ripemd160');
            let hashlength = secjs_hash_test.getHashLength();
            expect(hashlength).to.equal(20);
        })
    })
})
