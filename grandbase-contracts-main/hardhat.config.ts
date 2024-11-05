import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    mainnet: {
      // url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      url: `https://ethereum.publicnode.com`,
      accounts: [process.env.ACCOUNT_PRIV_KEY ?? ""]
    },
    // baseGoerli: {
    //   url: process.env.BASE_GOERLI_RPC,
    //   accounts: [process.env.ACCOUNT_PRIV_KEY ?? ""],
    //   gasPrice: 1000000000,
    // },
    base: {
      url: process.env.BASE_RPC,
      // accounts: [process.env.BASE_ACCOUNT_PRIV_KEY ?? ""]  //// GrandPass Deployer
      accounts: [process.env.ACCOUNT_PRIV_KEY ?? ""]
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      accounts: [process.env.ACCOUNT_PRIV_KEY ?? ""]
    },
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: [process.env.ACCOUNT_PRIV_KEY ?? ""]
    }
  },

  etherscan: {
    apiKey: {
      base: process.env.BASE_API_KEY ?? "",
      // baseGoerli: process.env.BASE_GOERLI_API_KEY ?? "",
      mainnet: "FU1AS6EIA7CMEYS2SFP7Q4R4HEC2B33KV3", //etherscan_api
      sepolia: 'FU1AS6EIA7CMEYS2SFP7Q4R4HEC2B33KV3',
      baseSepolia: "EKG6VBVE6NMA9TA9SZZ4AH6QF3P4IDJMMK"
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api/",
          /*apiURL: "https://api-sepolia.basescan.org/api",*/
          browserURL: "https://sepolia-explorer.base.org/"
        }
      },
      // {
      //   network: "baseGoerli",
      //   chainId: 84531,
      //   urls: {
      //     apiURL: "https://api-goerli.basescan.org/api",
      //     browserURL: "https://goerli.basescan.org"
      //   }
      // },
      {
        network: "ethsepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api/",
          browserURL: "https://sepolia.etherscan.io/"
        }
      }
    ]
  },
  defaultNetwork: "baseSepolia"
};

export default config;
