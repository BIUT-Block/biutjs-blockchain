const BIUTUtils = require('@biut-block/biutjs-util')

exports.biutGeneBlock = {
  Number: 0,
  ReceiptRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: BIUTUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: BIUTUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'BIUT blockchain hello world',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900030,
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

exports.biutTestGeneBlock = {
  Number: 0,
  ReceiptRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: BIUTUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: BIUTUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'BIUT blockchain test network',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900030,
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
  ReceiptRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: BIUTUtils.zeros(256).toString('hex'),
  MixHash: BIUTUtils.zeros(32).toString('hex'),
  StateRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: BIUTUtils.zeros(32).toString('hex'),
  Beneficiary: BIUTUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'SEN blockchain hello world',
  Nonce: BIUTUtils.zeros(8).toString('hex'),
  Transactions: []
}

exports.senTestGeneBlock = {
  Number: 0,
  ReceiptRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: BIUTUtils.zeros(256).toString('hex'),
  MixHash: BIUTUtils.zeros(32).toString('hex'),
  StateRoot: BIUTUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: BIUTUtils.zeros(32).toString('hex'),
  Beneficiary: BIUTUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'SEN blockchain test network',
  Nonce: BIUTUtils.zeros(8).toString('hex'),
  Transactions: []
}
