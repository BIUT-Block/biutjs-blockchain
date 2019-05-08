const SECUtils = require('@sec-block/secjs-util')

exports.secGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900020,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'SEC blockchain hello world',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900020,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: '0000000000000000000000000000000000000001',
    Value: '1500000000',
    GasLimit: '0',
    GasUsedByTxn: '0',
    GasPrice: '0',
    TxFee: '0',
    Nonce: '0',
    InputData: '1.5 billion initial tokens',
    Signature: {}
  }]
}

exports.secTestGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900020,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'SEC blockchain test network',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900020,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: '0000000000000000000000000000000000000001',
    Value: '1500000000',
    GasLimit: '0',
    GasUsedByTxn: '0',
    GasPrice: '0',
    TxFee: '0',
    Nonce: '0',
    InputData: '1.5 billion initial tokens',
    Signature: {}
  }]
}

exports.senGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: SECUtils.zeros(32).toString('hex'),
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900020,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'SEN blockchain hello world',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: []
}

exports.senTestGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: SECUtils.zeros(32).toString('hex'),
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900020,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'SEN blockchain test network',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: []
}
