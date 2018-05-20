/**
 * define of token transaction model
 */
let tokenchainTransModel = {
    TxHash: "",
    TxReceiptStatus: "", // token processing status: pending, success, error
    Version: "",
    BlockHeight:"",
    TimeStamp: "",
    TxFrom: "",
    TxTo: "",
    Value: "",
    GasLimit: "", // Do we need actually?
    GasUsedByTxn: "", // Do we need actually?
    GasPrice: "", // Do we need actually?
    TxFee: "", // Do we need actually? TxFee = GasUsedByTxn x GasPrice
    Nonce: "",
    InputData: ""
}

module.exports = tokenchainTransModel;