let transactionchainTransModel = {
    // TxHash: "",
    // TxReceiptStatus: "",
    // Version: "",
    // BlockHeight:"",
    // TimeStamp: "",
    // TxFrom: "",
    // TxTo: "",
    // Value: "",
    // GasLimit: "", // Do we need actually?
    // GasUsedByTxn: "", // Do we need actually?
    // GasPrice: "", // Do we need actually?
    // TxFee: "", // Do we need actually?
    // Nonce: "",
    // inputData: ""
    TxHash: '',
    TxReceiptStatus: '',
    Version: '',
    BlockHeight: '',
    TimeStamp: '',
    SellerAddress: '',
    BuyerAddress: '',
    ShareHash: '',
    ShareTimeStamp: '',
    ProductInfo: {
        Name: '',
        Category: '',
        Brand: '',
        Manifactory: '',
        Seller: '',
        Buyer: '',
        SKU: '',
        EAN: '',
        Price: '',
        Currency: '',
        Description: '',
    },  
    SharedTimes: 0,
    Status: '',
    InputData: ""
}

module.export = transactionchainTransModel;