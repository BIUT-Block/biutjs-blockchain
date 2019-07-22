const SECUtils = require('@biut-block/biutjs-util')

// -------------------------  Main network genesis blocks  ------------------------
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
  ExtraData: 'Main Network BIUT blockchain Gensis Block',
  Nonce: '',
  Transactions: [{
    TxHash:
    'b5b4c85a81706e4742bbf82808809f2e5b922dbd381f7b70a2b81674c258a8c9',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900020,
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
  TimeStamp: 1537900020,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'Main Network BIU blockchain Gensis Block',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: [{
    TxHash:
    '050654e254e5514fa4104c783f2940a40e526c9614ca9e7f5d476adac6739591',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900020,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
    Value: '100000000',
    GasLimit: '0',
    GasUsedByTxn: '0',
    GasPrice: '0',
    TxFee: '0',
    Nonce: '0',
    InputData: '100 million initial tokens',
    Signature: {}
  }]
}

// -------------------------  Test network genesis blocks  ------------------------
exports.secTestGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'Test Network BIUT blockchain Gensis Block',
  Nonce: '',
  Transactions: [{
    TxHash:
    'b5b4c85a81706e4742bbf82808809f2e5b922dbd381f7b70a2b81674c258a8c9',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900030,
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
  },
  { TxHash: '5ff3974b1b85c29a0b719332be5b74633b752baf40c69fb4fc0a3848955bb88e',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1558252961165,
    TxFrom: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
    TxTo: '000000000000000000000000000000000003',
    Value: '0',
    GasLimit: '0',
    GasUsedByTxn: '0',
    GasPrice: '0',
    TxFee: '0',
    Nonce: '0',
    InputData: '{"sourceCode":"ZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgYW1vdW50KSB7DQogICAgdmFyIHRyYW5zZmVyRmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICB0cmFuc2ZlckZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBhZGRyZXNzLCAnQW1vdW50JzogYW1vdW50LCAnVHJhbnNmZXJGbGFnJzogdHJhbnNmZXJGbGFnfQ0KfQ0KDQpmdW5jdGlvbiBzdW1OdW1iZXIoYSxiKXsNCiAgICByZXR1cm4gYSArIGINCn0NCg0KZnVuY3Rpb24gZGVwb3NpdChhbW91bnQpew0KICAgIHZhciBkZXBvc2l0RmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICBkZXBvc2l0RmxhZyA9IHRydWUNCiAgICB9DQogICAgcmV0dXJuIHsnQW1vdW50JzogYW1vdW50LCAnRGVwb3NpdEZsYWcnOiBkZXBvc2l0RmxhZ30NCn0NCg0KZnVuY3Rpb24gd2l0aGRyYXcoYmVuZWZpdEFkZHJlc3MsIGFtb3VudCl7DQogICAgdmFyIHdpdGhkcmF3RmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICB3aXRoZHJhd0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1dpdGhkcmF3RmxhZyc6IHdpdGhkcmF3RmxhZ30NCn0NCg0KZnVuY3Rpb24gbG9jayhiZW5lZml0QWRkcmVzcywgYW1vdW50LCB0aW1lKXsNCiAgICB2YXIgbG9ja0ZsYWcgPSBmYWxzZQ0KICAgIGlmKGFtb3VudD4wKXsNCiAgICAgICAgbG9ja0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1RpbWUnOiB0aW1lLCAnTG9ja0ZsYWcnOiBsb2NrRmxhZ30NCn0NCg0KZnVuY3Rpb24gcmVsZWFzZUxvY2soYmVuZWZpdEFkZHJlc3MsIGFtb3VudCl7DQogICAgdmFyIHJlbGVhc2VMb2NrRmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICByZWxlYXNlTG9ja0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1JlbGVhc2VMb2NrRmxhZyc6IHJlbGVhc2VMb2NrRmxhZ30NCn0=","totalSupply":1500000000,"tokenName":"SEC"}',
    Signature: {}
  }
  ]
}

exports.senTestGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: SECUtils.zeros(32).toString('hex'),
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'Test Network BIU blockchain Gensis Block',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: [{
      TxHash:
      '050654e254e5514fa4104c783f2940a40e526c9614ca9e7f5d476adac6739591',
      TxReceiptStatus: 'success',
      Version: '0.1',
      TimeStamp: 1537900030,
      TxFrom: '0000000000000000000000000000000000000000',
      TxTo: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
      Value: '100000000',
      GasLimit: '0',
      GasUsedByTxn: '0',
      GasPrice: '0',
      TxFee: '0',
      Nonce: '0',
      InputData: '100 million initial tokens',
      Signature: {}
    },
    { TxHash: '5ff3974b1b85c29a0b719332be5b74633b752baf40c69fb4fc0a3848955bb88e',
      TxReceiptStatus: 'success',
      Version: '0.1',
      TimeStamp: 1558252961165,
      TxFrom: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
      TxTo: '000000000000000000000000000000000001',
      Value: '0',
      GasLimit: '0',
      GasUsedByTxn: '0',
      GasPrice: '0',
      TxFee: '0',
      Nonce: '0',
      InputData: '{"sourceCode":"ZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgYW1vdW50KSB7DQogICAgdmFyIHRyYW5zZmVyRmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICB0cmFuc2ZlckZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBhZGRyZXNzLCAnQW1vdW50JzogYW1vdW50LCAnVHJhbnNmZXJGbGFnJzogdHJhbnNmZXJGbGFnfQ0KfQ0KDQpmdW5jdGlvbiBzdW1OdW1iZXIoYSxiKXsNCiAgICByZXR1cm4gYSArIGINCn0NCg0KZnVuY3Rpb24gZGVwb3NpdChhbW91bnQpew0KICAgIHZhciBkZXBvc2l0RmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICBkZXBvc2l0RmxhZyA9IHRydWUNCiAgICB9DQogICAgcmV0dXJuIHsnQW1vdW50JzogYW1vdW50LCAnRGVwb3NpdEZsYWcnOiBkZXBvc2l0RmxhZ30NCn0NCg0KZnVuY3Rpb24gd2l0aGRyYXcoYmVuZWZpdEFkZHJlc3MsIGFtb3VudCl7DQogICAgdmFyIHdpdGhkcmF3RmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICB3aXRoZHJhd0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1dpdGhkcmF3RmxhZyc6IHdpdGhkcmF3RmxhZ30NCn0NCg0KZnVuY3Rpb24gbG9jayhiZW5lZml0QWRkcmVzcywgYW1vdW50LCB0aW1lKXsNCiAgICB2YXIgbG9ja0ZsYWcgPSBmYWxzZQ0KICAgIGlmKGFtb3VudD4wKXsNCiAgICAgICAgbG9ja0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1RpbWUnOiB0aW1lLCAnTG9ja0ZsYWcnOiBsb2NrRmxhZ30NCn0NCg0KZnVuY3Rpb24gcmVsZWFzZUxvY2soYmVuZWZpdEFkZHJlc3MsIGFtb3VudCl7DQogICAgdmFyIHJlbGVhc2VMb2NrRmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICByZWxlYXNlTG9ja0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1JlbGVhc2VMb2NrRmxhZyc6IHJlbGVhc2VMb2NrRmxhZ30NCn0=","totalSupply":100000000,"tokenName":"SEN"}',
      Signature: {}
    },    
    { TxHash: '5ff3974b1b85c29a0b719332be5b74633b752baf40c69fb4fc0a3848955bb88e',
      TxReceiptStatus: 'success',
      Version: '0.1',
      TimeStamp: 1558252961165,
      TxFrom: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
      TxTo: '000000000000000000000000000000000002',
      Value: '0',
      GasLimit: '0',
      GasUsedByTxn: '0',
      GasPrice: '0',
      TxFee: '0',
      Nonce: '0',
      InputData: '{"sourceCode":"ZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgYW1vdW50KSB7DQogICAgdmFyIHRyYW5zZmVyRmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICB0cmFuc2ZlckZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBhZGRyZXNzLCAnQW1vdW50JzogYW1vdW50LCAnVHJhbnNmZXJGbGFnJzogdHJhbnNmZXJGbGFnfQ0KfQ0KDQpmdW5jdGlvbiBzdW1OdW1iZXIoYSxiKXsNCiAgICByZXR1cm4gYSArIGINCn0NCg0KZnVuY3Rpb24gZGVwb3NpdChhbW91bnQpew0KICAgIHZhciBkZXBvc2l0RmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICBkZXBvc2l0RmxhZyA9IHRydWUNCiAgICB9DQogICAgcmV0dXJuIHsnQW1vdW50JzogYW1vdW50LCAnRGVwb3NpdEZsYWcnOiBkZXBvc2l0RmxhZ30NCn0NCg0KZnVuY3Rpb24gd2l0aGRyYXcoYmVuZWZpdEFkZHJlc3MsIGFtb3VudCl7DQogICAgdmFyIHdpdGhkcmF3RmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICB3aXRoZHJhd0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1dpdGhkcmF3RmxhZyc6IHdpdGhkcmF3RmxhZ30NCn0NCg0KZnVuY3Rpb24gbG9jayhiZW5lZml0QWRkcmVzcywgYW1vdW50LCB0aW1lKXsNCiAgICB2YXIgbG9ja0ZsYWcgPSBmYWxzZQ0KICAgIGlmKGFtb3VudD4wKXsNCiAgICAgICAgbG9ja0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1RpbWUnOiB0aW1lLCAnTG9ja0ZsYWcnOiBsb2NrRmxhZ30NCn0NCg0KZnVuY3Rpb24gcmVsZWFzZUxvY2soYmVuZWZpdEFkZHJlc3MsIGFtb3VudCl7DQogICAgdmFyIHJlbGVhc2VMb2NrRmxhZyA9IGZhbHNlDQogICAgaWYoYW1vdW50PjApew0KICAgICAgICByZWxlYXNlTG9ja0ZsYWcgPSB0cnVlDQogICAgfQ0KICAgIHJldHVybiB7J0FkZHJlc3MnOiBiZW5lZml0QWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1JlbGVhc2VMb2NrRmxhZyc6IHJlbGVhc2VMb2NrRmxhZ30NCn0=","totalSupply":100000000,"tokenName":"MToken"}',
      Signature: {}
    }]
}

// -------------------------  Develop network genesis blocks  ------------------------
exports.secDevGeneBlock = {
  Number: 0,
  ReceiptRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  LogsBloom: SECUtils.zeros(256).toString('hex'),
  MixHash: '',
  StateRoot: SECUtils.KECCAK256_RLP.toString('hex'),
  TimeStamp: 1537900030,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: '',
  Difficulty: '',
  ExtraData: 'Develop Network BIUT blockchain Gensis Block',
  Nonce: '',
  Transactions: [{
    TxHash:
    'b5b4c85a81706e4742bbf82808809f2e5b922dbd381f7b70a2b81674c258a8c9',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900030,
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
  TimeStamp: 1537900030,
  ParentHash: SECUtils.zeros(32).toString('hex'),
  Beneficiary: SECUtils.zeros(20).toString('hex'),
  Difficulty: '1',
  ExtraData: 'Develop Network BIU blockchain Gensis Block',
  Nonce: SECUtils.zeros(8).toString('hex'),
  Transactions: [{
    TxHash:
    '050654e254e5514fa4104c783f2940a40e526c9614ca9e7f5d476adac6739591',
    TxReceiptStatus: 'success',
    Version: '0.1',
    TimeStamp: 1537900030,
    TxFrom: '0000000000000000000000000000000000000000',
    TxTo: 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5',
    Value: '100000000',
    GasLimit: '0',
    GasUsedByTxn: '0',
    GasPrice: '0',
    TxFee: '0',
    Nonce: '0',
    InputData: '100 million initial tokens',
    Signature: {}
  }]
}
