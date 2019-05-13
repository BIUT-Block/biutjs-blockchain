const SECBlockchain = require('../src/index')
const mockData = require('./mock-date-str')

let tokenBlock = new SECBlockchain.SECTokenBlock(mockData.tokenBlock)
// console.log(tokenBlock.getBlock().Number)
// let buffer = tokenBlock.getBlockBuffer()
// console.log(buffer.length)
// let header = tokenBlock.getHeader()
// console.log(header)
// let headerBuffer = tokenBlock.getHeaderBuffer()
// console.log(headerBuffer.length)

// let headerHash = tokenBlock.getHeaderHash()
// console.log(headerHash.length)

// let body = tokenBlock.getBody()
// let bodyMock = mockData.tokenBlock.Transactions
// console.log(body)
// console.log(bodyMock)
// let bodyBuffer = tokenBlock.getBodyBuffer()
// console.log(bodyBuffer)
// let bodyHash = tokenBlock.getBodyHash()
// console.log(bodyHash)

let powHeaderBuffer = tokenBlock.getPowHeaderBuffer()
console.log(powHeaderBuffer[0])
let powHeaderHashBuffer = tokenBlock.getPowHeaderHashBuffer()
console.log(powHeaderHashBuffer.toString('hex'))
