/**
 * define of token chain model
 */
let tokenchainBlockModel = {
    Height: "",
    TimeStamp: "",
    Transactions: [], // < 300 Transactions
    Hash: "",
    Parent_Hash: "",
    // Sha3Uncles: "",
    Mined_By: "",
    Difficulty: "",
    Total_Difficulty: "",
    Size: "", // < 75,000 Bytes
    Gas_Used: "",
    Gas_Limit: "", // < 8,000,000
    Nonce: "",
    Block_Reward: "", // < 10 SEC
    // Uncles_Reward: "",
    Extra_Data: "",
}

module.exports = tokenchainBlockModel;