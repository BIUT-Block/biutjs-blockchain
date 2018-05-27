let randomGen = require('../utils/secjs-random-generate');
let expect = require('chai').expect

describe('secjs-random-generate', () => {
    describe('random generation correctness test', () => {
        it('shoud generate a random string with defined length', () => {
            for(let i = 0; i < 100; i ++){
                let result = randomGen.randomGenerate('string', i)
                expect(result.length).to.equal(i)
            }
        })

        it('shoud generate a random integer within defined range', () => {
            for(let i = 0; i < 1000; i = i + 10){
                let result = randomGen.randomGenerate('number', i)
                expect(result).to.be.within(0, i)
            }
        })
    })

    describe('random generation invalid input test', () => {
        it('throw an error when input "type" is invalid', () => {
            expect(() => {randomGen.randomGenerate('sdasda', 10)}).to.throw('Wrong random generate data type') 
            expect(() => {randomGen.randomGenerate([123], 10)}).to.throw('Wrong random generate data type') 
        })

        it('throw an error when input "length" is invalid', () => {
            expect(() => {randomGen.randomGenerate('string', -1)}).to.throw('Input length is invalid') 
            expect(() => {randomGen.randomGenerate('number', -1)}).to.throw('Input length is invalid') 
        })
    })
})