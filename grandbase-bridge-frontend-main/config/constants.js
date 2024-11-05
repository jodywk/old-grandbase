export const GBMIGRATOR_CONTRACT_ADDRESS = {
    11155111: "0xF0c970295b4238B9dC87a46327eCBbc208D7ed2c",     //sepolia
    84532: "0x114C33a330c91d55C726738f7C09CC81EA9323e4",      //base-sepolia
    97: "0xB6ab107C0572D01F615Cf985Ff643a9b03384491", // bsc-testnet

    1: "0x2CF2C6A72fCc04814A11bDE8ffce9ce730AD2f42",      // ethereum
    8453: "0x802bfA2faD81Aa7C706F76E9eC58569D246525A5"        // base
}

export const GBTOKEN_ADDRESS = {
    11155111: "0x2afc08b10628cD4d51523d5A50E63311C9cbB7B7", // sepolia
    84532: "0x2afc08b10628cD4d51523d5A50E63311C9cbB7B7",      // base-sepolia
    97: "0x06eef5fBBa6234D78Dc5EFdD4A172aC9DAa96d26",       // bsc-testnet

    1: "0x743494393d802ac25c39d7882b10d7fd08293686",      // ethereum
    8453: "0x2aF864fb54b55900Cd58d19c7102d9e4FA8D84a3"        // base
}

// export const SRC_CHAIN_ID = 11155111;    // sepolia
export const SRC_CHAIN_ID = 1;    // ethereum
// export const DST_CHAIN_ID = 84532;      // base-sepolia
// export const DST_CHAIN_ID = 97;      // bsc-testnet
export const DST_CHAIN_ID = 8453;      // bsc-testnet

// export const DST_LAYERZERO_ID = 10245;      // base-sepolia
// export const DST_LAYERZERO_ID = 10102;      // bsc-testnet
export const DST_LAYERZERO_ID = 184;      // base

export const DST_RPC_URL = {
    84532 : "https://base-sepolia-rpc.publicnode.com", // base-sepolia
    8453 : "https://base-rpc.publicnode.com", // base
    97: "https://bsc-testnet-rpc.publicnode.com" // bsc-testnet
}

export const LAYERZERO_SCAN_URL = {
    11155111: "https://testnet.layerzeroscan.com",  // sepolia
    84532 : "https://testnet.layerzeroscan.com",     // base-sepolia
    97 : "https://testnet.layerzeroscan.com",       // bsc-testnet

    1: "https://layerzeroscan.com",     // ethereum
    8453: "https://layerzeroscan.com"   // base
}
