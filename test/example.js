const SECTokenBlockchain = require('../src/secjs-token-blockchain')
const SECTxBlockchain = require('../src/secjs-transaction-blockchain')

let sectokenblockchain = new SECTokenBlockchain()
let secTxblockchain = new SECTxBlockchain()
let mockdataToken = [{
  "Number": 0,
  "TransactionsRoot": "",
  "ReceiptRoot": "",
  "LogsBloom": "",
  "MixHash": "",
  "StateRoot": "",
  "TimeStamp": 1530297308,
  "Transactions": [],
  "ParentHash": "Genesis",
  "Beneficiary": "SEC",
  "Difficulty": 1,
  "GasUsed": 0,
  "GasLimit": 0,
  "ExtraData": "SEC Hello World",
  "Nonce": "",
  "Hash": "5f213ac06cfe4a82e167aa3ea430e520be99dcedb4ab47fd8f668448708e34c1"
}, {
  "Number": 1,
  "TransactionsRoot": "",
  "ReceiptRoot": "",
  "LogsBloom": "",
  "MixHash": "",
  "StateRoot": "",
  "TimeStamp": 1530297318,
  "Transactions": [{
    "TxHash": "401407fa4423c317f9c4d288e08c69c6853fea934ce53a094281358c1ef6526d",
    "TxReceiptStatus": "success",
    "Version": "0.0.1",
    "BlockNumber": 1,
    "TimeStamp": 1530297310,
    "TxFrom": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "TxTo": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "Value": 0,
    "GasLimit": 4279,
    "GasUsedByTxn": 374,
    "GasPrice": 0.001,
    "TxFee": 0.374,
    "Nonce": 7268,
    "InputData": "Test Token Transaction"
  }],
  "Hash": "d30e75b804fa4ca0b10a5556ef96a51f968509efb3a3edfdd2f478bc8656aa6d",
  "ParentHash": "5f213ac06cfe4a82e167aa3ea430e520be99dcedb4ab47fd8f668448708e34c1",
  "Beneficiary": "17miUjTe6UNmxviZypf9W3dKKWJyBNFpvK",
  "Difficulty": 1579,
  "GasUsed": 7993,
  "GasLimit": 97388,
  "Nonce": 932,
  "ExtraData": "Test Token cases"
}, {
  "Number": 2,
  "TransactionsRoot": "",
  "ReceiptRoot": "",
  "LogsBloom": "",
  "MixHash": "",
  "StateRoot": "",
  "TimeStamp": 1530297328,
  "Transactions": [{
    "TxHash": "8e10bfb36a8b6b2c81a17d8818863eeabab315baca38adb1b4f029bfe56f9374",
    "TxReceiptStatus": "success",
    "Version": "0.0.1",
    "BlockNumber": 2,
    "TimeStamp": 1530297320,
    "TxFrom": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "TxTo": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "Value": 0,
    "GasLimit": 2971,
    "GasUsedByTxn": 784,
    "GasPrice": 0.001,
    "TxFee": 0.784,
    "Nonce": 5807,
    "InputData": "Test Token Transaction"
  }, {
    "TxHash": "511570b94bcf98061265974f74b29fbe5e179c47fc22b1eb7505901fe97f8c3f",
    "TxReceiptStatus": "success",
    "Version": "0.0.1",
    "BlockNumber": 2,
    "TimeStamp": 1530297322,
    "TxFrom": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "TxTo": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "Value": 1,
    "GasLimit": 8052,
    "GasUsedByTxn": 92,
    "GasPrice": 0.001,
    "TxFee": 0.092,
    "Nonce": 1971,
    "InputData": "Test Token Transaction"
  }, {
    "TxHash": "adc1464538bb2ecbba627692d58db9958b76ed8bfdbc5b52d644596e9e3c3eec",
    "TxReceiptStatus": "success",
    "Version": "0.0.1",
    "BlockNumber": 2,
    "TimeStamp": 1530297324,
    "TxFrom": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "TxTo": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "Value": 0,
    "GasLimit": 1042,
    "GasUsedByTxn": 2,
    "GasPrice": 0.001,
    "TxFee": 0.002,
    "Nonce": 9024,
    "InputData": "Test Token Transaction"
  }, {
    "TxHash": "f3701c2a94590a353a6b91c3fdc058f22fbd262d282fac4ae55272e41af0efd2",
    "TxReceiptStatus": "success",
    "Version": "0.0.1",
    "BlockNumber": 2,
    "TimeStamp": 1530297326,
    "TxFrom": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "TxTo": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
    "Value": 0,
    "GasLimit": 9450,
    "GasUsedByTxn": 810,
    "GasPrice": 0.001,
    "TxFee": 0.81,
    "Nonce": 4621,
    "InputData": "Test Token Transaction"
  }],
  "Hash": "9cbf45bdfd9808ec8632702a866cb066d2ed6cc24ad2e1ca21eb41c76368fd14",
  "ParentHash": "d30e75b804fa4ca0b10a5556ef96a51f968509efb3a3edfdd2f478bc8656aa6d",
  "Beneficiary": "17miUjTe6UNmxviZypf9W3dKKWJyBNFpvK",
  "Difficulty": 659,
  "GasUsed": 9905,
  "GasLimit": 39293,
  "Nonce": 2540,
  "ExtraData": "Test Token cases"
}]

let mockdataTx = [{
  "Number": 0,
  "TransactionsRoot":"",
  "ReceiptRoot":"",
  "TimeStamp": 1530297308,
  "Transactions": [],
  "ParentHash": "Genesis",
  "Beneficiary": "SEC",
  "ExtraData": "SEC Hello World",
  "Nonce": "",
  "Hash": "04c7123071429bbfcfb6ffd22501bdcc575f8df820041d63d8c16b94a9696ecf"
}, {
  "Number": 1,
  "TransactionsRoot":"",
  "ReceiptRoot":"",
  "TimeStamp": 1530297318,
  "Transactions": [{
      "TxHash": "726f385853f6824f209a6a5eb80659ed5432ed4a76af04601fea4302cf7333fd",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 1,
      "TimeStamp": 1530297311,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297311,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "466d81b30fd0e70c164d870a55e5e0eff3d430b2d52e65cc4d4338b420f99396",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 1,
      "TimeStamp": 1530297314,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297314,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "e973165029e704633de63a7fd615c574dbbedbd3de0a4e3f3c411f1b8898f766",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 1,
      "TimeStamp": 1530297317,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297317,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }],
  "Hash": "85aec575af965c0f6daa3179152be5f37977968882a6f48f952fca790305265f",
  "ParentHash": "04c7123071429bbfcfb6ffd22501bdcc575f8df820041d63d8c16b94a9696ecf",
  "Beneficiary": "17miUjTe6UNmxviZypf9W3dKKWJyBNFpvK",
  "Nonce": 8858,
  "Block_Reward": "",
  "ExtraData": "Test Tx cases"
}, {
  "Number": 2,
  "TransactionsRoot":"",
  "ReceiptRoot":"",
  "TimeStamp": 1530297328,
  "Transactions": [{
      "TxHash": "1bcbe2a9b44ec55352127c6ff3eac79fd632483018c0070a61f911076fbfd698",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 2,
      "TimeStamp": 1530297320,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297320,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "f20ca2c579eef7c6cb723ecd41f53eb8ad063fd0d332c42f632aeda933cd6f5e",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 2,
      "TimeStamp": 1530297323,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297323,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "26af3f789c6725b3a287ac8fb168d912ed9b77c85ab989c859a3a86dc654b0b0",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 2,
      "TimeStamp": 1530297326,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297326,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }],
  "Hash": "11346530b890976525b1742c466600a4fa97c0b0a0bfcb6587fe9765f3fd7f7a",
  "ParentHash": "85aec575af965c0f6daa3179152be5f37977968882a6f48f952fca790305265f",
  "Beneficiary": "17miUjTe6UNmxviZypf9W3dKKWJyBNFpvK",
  "Nonce": 5472,
  "Block_Reward": "",
  "ExtraData": "Test Tx cases"
}, {
  "Number": 3,
  "TransactionsRoot":"",
  "ReceiptRoot":"",
  "TimeStamp": 1530297338,
  "Transactions": [{
      "TxHash": "6a4d71573b13d69026a301e43219573fbd4ffbeae44b5b8928f7c97ec66d9830",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 3,
      "TimeStamp": 1530297329,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297329,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "9f4edf56eedd58a72a8a63aea6084304288caad86706a038607082ed21c23248",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 3,
      "TimeStamp": 1530297332,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297332,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "5e80bc3c1f9c7242072fa5a31ca7724971da4b61ffb8e4a3b477886c7a14896b",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 3,
      "TimeStamp": 1530297335,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297335,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }, {
      "TxHash": "d66a5f06eddb7d59eead360b971cdd3eb5fc8489551494df969d212d5a35b36a",
      "TxReceiptStatus": "success",
      "Version": "0.0.1",
      "BlockNumber": 3,
      "TimeStamp": 1530297338,
      "SellerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "BuyerAddress": "1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju",
      "ShareHash": "4c9e200035cf3667a094610d57d8a325ac72ac982286474a53a0a00da1396a22",
      "ShareTimeStamp": 1530297338,
      "ProductInfo": {
          "Name": "Test Product",
          "Category": "Test",
          "Brand": "Test",
          "Manifactory": "Test",
          "Seller": "Taobao",
          "Buyer": "SEC",
          "SKU": "0101011",
          "EAN": "4123569875457",
          "Price": "150",
          "Currency": "Dollar",
          "Description": "Test Product Description"
      },
      "SharedTimes": 1,
      "Status": "origin",
      "InputData": "Test Tx Transaction"
  }],
  "Hash": "a85e16c8a400ed6f4735a1ad9b747603844272ed63da69549bfe29da2827da2c",
  "ParentHash": "11346530b890976525b1742c466600a4fa97c0b0a0bfcb6587fe9765f3fd7f7a",
  "Beneficiary": "17miUjTe6UNmxviZypf9W3dKKWJyBNFpvK",
  "Nonce": 2893,
  "Block_Reward": "",
  "ExtraData": "Test Tx cases"
}]

sectokenblockchain.init((err) => {
  if (err) {
    throw new Error(err.message)
  }
  console.log('Put genesis block success')
  sectokenblockchain.putBlockToDB(mockdataToken[1], () => {
    sectokenblockchain.getBlocksWithHashFromDB(['cdaf28c336abd066a58527390d37493024e3c878d1730a197c586803a056afdc', mockdataToken[1].Hash], (err, data) => {
      if (err) {
        throw new Error(`error message: ${err.message}`)
      }
      sectokenblockchain.getAllBlockChainFromDB(() => {
        let height = sectokenblockchain.getCurrentHeight()
        console.log(`The current height: ${height}`)
      })
    })
  })
})

secTxblockchain.init((err) => {
  if (err) {
    throw new Error(err.message)
  }
  console.log('Put genesis block success')
  console.log(secTxblockchain.txBlockChain)
  secTxblockchain.putBlockToDB(mockdataTx[1], () => {
    secTxblockchain.getBlocksWithHashFromDB(['e28bacb7657c8dd79ee58046ead1d06000aec59ed2309ffebd29e9dbb5f72ea9', mockdataTx[1].Hash], (err, data) => {
      if (err) {
        throw new Error(`error message: ${err.message}`)
      }
      secTxblockchain.getAllBlockChainFromDB(() => {
        let height = secTxblockchain.getCurrentHeight()
        console.log(`The current height: ${height}`)
      })
    })
  })
})