import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    ethereum: {
      url: process.env.ETHEREUM_RPC ?? ""
    },
    seplolia: {
      url: process.env.SEPOLIA_RPC ?? ""
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY ?? ""
    }
  }
};

export default config;
