/**
 * define of token chain model
 */
let tokenchainBlockModel = {
  Number: 0, // yes
  TransactionsRoot: '', // 由当前区块中所包含的所有交易所组成的树结构（transaction trie）根节点的Keccak 256 位哈希
  ReceiptRoot: '', // 由当前区块中所有交易的收据所组成的树结构（receipt trie）根节点的Keccak 256位哈希
  LogsBloom: '', // Bloom过滤器(Filter)，用来快速判断一个参数Log对象是否存在于一组已知的Log集合中
  MixHash: '', // yes
  StateRoot: '', // 所有交易被执行完且区块定稿后的状态树（state trie）根节点的Keccak 256 位哈希
  TimeStamp: 0, // yes
  ParentHash: '', // yes
  Difficulty: '1', // yes
  GasUsed: '0', // yes
  GasLimit: '0', // yes
  ExtraData: '', // yes
  Nonce: '', // yes
  Hash: '', // yes
  Beneficiary: '', // yes
  Transactions: [] // yes
}

module.exports = tokenchainBlockModel

/*
given:
  Number
  MixHash
  TimeStamp
  ParentHash
  Difficulty
  ExtraData
  Nonce
  Beneficiary
  Transactions

calculated:
  GasUsed
  GasLimit
  Hash

To be implemented:
  TransactionsRoot
  StateRoot
  ReceiptRoot
  LogsBloom
*/
