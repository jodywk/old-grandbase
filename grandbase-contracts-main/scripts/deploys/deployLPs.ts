import { ethers } from "hardhat";
import { getDeployFilteredInfo, saveDeployAddress } from "../utils/info";
import { TestLPs } from "../utils/gassets";
import 'dotenv/config';
import BigNumber from 'bignumber.js';

const factoryABI = require("../../contracts/abis/PancakeFactory.json");
const routerABI = require("../../contracts/abis/PancakeRouter.json");
const gTokenABI = require("../../artifacts/contracts/GToken.sol/GToken.json");

export async function deployLPs() {
  const [signer] = await ethers.getSigners();

  const factoryAddress = process.env.BASE_GOERLI_FACTORY_ADDRESS;
  const routerAddress = process.env.BASE_GOERLI_ROUTER_ADDRESS;
  if (!factoryAddress || !routerAddress) {
    console.error("Add BASE_GOERLI_FACTORY_ADDRESS or BASE_GOERLI_ROUTER_ADDRESS in env file");
    process.exit(0);
  }

  const factory = new ethers.Contract(factoryAddress, factoryABI, signer);
  const router = new ethers.Contract(routerAddress, routerABI, signer);

  for (let [lp, assetPrice] of TestLPs) {
    const elements: string[] = lp.split('-');
    let token0 = getDeployFilteredInfo(elements[0]);
    let token1: { name: string, address: string, decimals?: number };

    if (elements[1] === "USDC") {
      token1 = getDeployFilteredInfo("Grandbase Faucet USDC") as { name: string, address: string };
      token1.decimals = 6;
    } else if (elements[1] === "USDT") {
      token1 = getDeployFilteredInfo("Grandbase Faucet USDT") as { name: string, address: string };
      token1.decimals = 6;
    } else if (elements[1] === "DAI") {
      token1 = getDeployFilteredInfo("Grandbase Faucet DAI") as { name: string, address: string };
      token1.decimals = 18;
    } else if (elements[1] === "ETH") {
      token1 = {
        name: "WETH",
        address: "0x4200000000000000000000000000000000000006"
      }
    } else {
      token1 = {
        name: "",
        address: ""
      }
    }
    // console.log(`>>> creating pair >>>\n${token0.name} - ${token1.name}  :  ${token0.address} - ${token1.address}`);
    let lpAddr = await factory.getPair(token0.address, token1.address);

    if (lpAddr === "0x0000000000000000000000000000000000000000") {
      await factory.createPair(token0.address, token1.address);
      lpAddr = await factory.getPair(token0.address, token1.address);
      saveDeployAddress(`BaseSwap LPs(${token0.name}- ${token1.name})`, lpAddr.toString());

      // addLiquidity
      const gtoken = new ethers.Contract(token0.address, gTokenABI.abi, signer);
      await gtoken.mint(signer.address, "10000000000000000000000000000");
      await gtoken.approve(routerAddress, "10000000000000000000000000000");
      console.log(`${token0.name} is minted and approved`);

      // faucet token approve
      const faucetToken = new ethers.Contract(token1.address, gTokenABI.abi, signer);
      await faucetToken.approve(routerAddress, "10000000000000000000000000000");
      console.log(`${token1.name} is approved`);

      let amountA = 1000;
      let amountB = amountA * assetPrice;
      await router.addLiquidity(
        token0.address, 
        token1.address, 
        new BigNumber(amountA).multipliedBy(Math.pow(10, 18)).toFixed(0),
        new BigNumber(amountB).multipliedBy(Math.pow(10, token1?.decimals ?? 0)).toFixed(0),
        0,
        0,
        signer.address,
        "10000000000000000000000000000" // deadline
      )
      console.log(`Added Liquidity for ${token0.name} - ${token1.name}`);
    }
    // console.log(">>> lpAddr >>>", lpAddr);
  }
}