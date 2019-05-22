const SECUtils = require('@biut-block/biutjs-util')

// -------------------------  Main network genesis blocks  ------------------------
exports.secGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900000,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'Main Network BIUT blockchain Gensis Block',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900000,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
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
  TimeStamp: 1537900000,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'Main Network BIU blockchain Gensis Block',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: []
}

// -------------------------  Test network genesis blocks  ------------------------
exports.secTestGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900000,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'Test Network BIUT blockchain Gensis Block',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900000,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
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

exports.secestGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: SECUtils.zeros(32).toString('hex'),
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900000,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'Test Network BIU blockchain Gensis Block',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: []
}

// -------------------------  Develop network genesis blocks  ------------------------
exports.secDevGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900000,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'Develop Network BIUT blockchain Gensis Block',
  Nonce: '',
  Transactions: [{
    TxHash:
    '4931dc83cb7eafb8367e5d933de24216a159337f54a2d7025d8e48c0ac73b75f',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900000,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
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

exports.senDevGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: SECUtils.zeros(32).toString('hex'),
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900000,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'Develop Network BIU blockchain Gensis Block',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: []
}
