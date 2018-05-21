let secjs_hash = require('../utils/secjs-hash');
let expect = require('chai').expect;

describe('secjs_hash', () => {
    describe('generate hash', () => {
        it('generate hash randomly', () => {
            let secjs_hash_test = new secjs_hash('sha256');
            let generatedHashLength = secjs_hash_test.hash('hash tester').length;
            expect(generatedHashLength).to.equal(64);
        });
    });
});
