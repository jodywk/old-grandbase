
import AggregatorAbi from "./abis/AggregatorV3Interface.json";
import GrandOracleAbi from "./abis/GrandOracle.json";
import ChainlinkAggreatorAbi from "./abis/EACAggregatorProxy.json";

import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
const PRICE_DECIMALS = 8;
export let PRICE_STORAGE: Record<string, string> = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let arbiProvider = ethers.getDefaultProvider("https://arb-mainnet.g.alchemy.com/v2/sGHgJTHaRouZQK_KfPacJsqQ5WqBIxZS");
let sepoliaBaseProvider = ethers.getDefaultProvider("https://sepolia.base.org");

const multicall = new Multicall({ ethersProvider: arbiProvider, tryAggregate: true });

// gAMZN, gAAPL, gGOOGL, gMETA, gMSFT

// from Arbitrum
const feedAddressList: Array<string> =
  [
    // "",
    // "",
    // "",
    // "",
    // "",
    "0xd6a77691f071E98Df7217BED98f38ae6d2313EBA",
    "0x8d0CC5f38f9E802475f2CFf4F9fc7000C2E1557c",
    "0x1D1a83331e9D255EB1Aaf75026B60dFD00A252ba",
    "0xcd1bd86fDc33080DCF1b5715B6FCe04eC6F85845",
    "0xDde33fb9F21739602806580bdd73BAd831DcA867",
    // "0x3609baAa0a9b1f0FE4d6CC01884585d0e191C3E3",
    // "0xcC3370Bde6AFE51e1205a5038947b9836371eCCb",
    // "0x9C4424Fd84C6661F97D8d6b3fc3C1aAc2BeDd137",
    // "0xA14d53bC1F1c0F31B4aA3BD109344E5009051a84",
    // "0x3dD6e51CB9caE717d5a8778CF79A04029f9cFDF8",
    // "0x9854e9a850e7C354c1de177eA953a6b1fba8Fc22",
    // "0xf6DA27749484843c4F02f5Ad1378ceE723dD61d4",
    // "0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c",
    // "0xC56765f04B248394CF1619D20dB8082Edbfa75b1",
    // "0x594b919AD828e693B935705c3F816221729E7AE8"
  ];
const readPrices = async () => {
  // feedAddress.
  let functionsToRead: Array<ContractCallContext> = [];


  // for (let asset of ASSETS) {
  //   functionsToRead.push({
  //     reference: asset.name,
  //     contractAddress: asset.feedAddress,
  //     abi: AggregatorAbi.abi,
  //     calls: [{
  //       reference: "price-get-func",
  //       methodName: "latestRoundData",
  //       methodParameters: []
  //     }]
  //   });
  // }
  for (let i in WHITELIST_ASSETS) {
    functionsToRead.push({
      reference: WHITELIST_ASSETS[i].name,
      contractAddress: feedAddressList[i], // WHITELIST_ASSETS[i].feedAddress, //feedAddressList[i],//
      abi: AggregatorAbi.abi,
      calls: [{
        reference: "price-get-func",
        methodName: "latestRoundData",
        methodParameters: []
      }]
    });
  }

  const results: ContractCallResults = await multicall.call(functionsToRead);

  let priceValues: Record<string, Array<BigNumber>> = {};
  for (let asset of WHITELIST_ASSETS) {
    let returnContext = results.results[asset.name]?.callsReturnContext[0];
    if (returnContext?.success) {
      priceValues[asset.name] = returnContext.returnValues.map((v: any) => new BigNumber(v.hex));

      // Update prices in local memory variable
      PRICE_STORAGE[asset.address] = priceValues[asset.name][1].toString();
    }
  }
  // ["roundId", "answer", "startedAt", "updatedAt", "answeredInRound"]

  return priceValues;
}

const writePrices = async (priceValues: Record<string, Array<BigNumber>>) => {

  let privKey = process.env.ORACLE_MANGER_PRIV_KEY;
  if (!privKey) {
    console.error("No Private Key found");
    return;
  }

  const signer = new ethers.Wallet(privKey, sepoliaBaseProvider);

  for (let i in WHITELIST_ASSETS) {
    let priceValue = priceValues[WHITELIST_ASSETS[i].name];
    let oracleAddress = baseFeedAddresses[i].address;
    const contract = new ethers.Contract(oracleAddress, ChainlinkAggreatorAbi.abi, signer);
    let pRoundId = priceValue[0].toString()
    let pAnswer = priceValue[1].toString()
    let pStartedAt = priceValue[2].toString()
    let pUpdatedAt = priceValue[3].toString()
    let pAnsweredInRound = priceValue[4].toString()

    let res = await contract.writeLatestRoundData(pRoundId, pAnswer, pStartedAt, pUpdatedAt, pAnsweredInRound);
    let receipt = await res.wait();
    console.log(`Write ${WHITELIST_ASSETS[i].name} FEED, txHash =`, receipt.transactionHash);
    await sleep(60 * 1000); // sleep 60s
  }

}

export const oracleService = async () => {
  console.log("Oracle server is running ...");
  while (1) {
    let prices = await readPrices();
    console.log("prices =", prices);
    await writePrices(prices);
    await sleep(24 * 60 * 60 * 1000); // update every 24 hours
    break;
  }
}

export const WHITELIST_ASSETS: Array<GAsset> = [
  {
    name: "gAMZN",
    desc: "Amazon",
    feedAddress: "0xd6a77691f071E98Df7217BED98f38ae6d2313EBA",
    address: "0xbB15aaC18375a0338c9474B9CF0C2b9555B1Fe4D",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAMZN.svg",
    decimals: 18,
  },
  {
    name: "gAAPL",
    desc: "Apple",
    feedAddress: "0x8d0CC5f38f9E802475f2CFf4F9fc7000C2E1557c",
    address: "0xC099F125e84fb3846a587624e08D7E986c74f77d",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gAAPL.svg",
    decimals: 18,
  },
  {
    name: "gGOOGL",
    desc: "Alphabet",
    feedAddress: "0x1D1a83331e9D255EB1Aaf75026B60dFD00A252ba ",
    address: "0xB89C8B2C3B98CA63E81B7AE7Fd2aADb7c3066B68",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gGOOGL.svg",
    decimals: 18,
  },
  {
    name: "gMETA",
    desc: "Meta",
    feedAddress: "0xcd1bd86fDc33080DCF1b5715B6FCe04eC6F85845 ",
    address: "0xd395dA9A9e7790AA2705f16129daf623519D8Bd2",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gMETA.svg",
    decimals: 18,
  },
  {
    name: "gMSFT",
    desc: "Microsoft",
    feedAddress: "0xDde33fb9F21739602806580bdd73BAd831DcA867",
    address: "0xfdDFB7750BB4Ad89F55891D1bb1d697b610d6b06",
    type: "EQUITY",
    image: "https://raw.githubusercontent.com/Grandbase-io/grandbase-assets/main/gMSFT.svg",
    decimals: 18,
  }];

let baseFeedAddresses = [
  {
    "name": "gAMZN-FEED",
    "address": "0xbCeDd41D9e58361dCF64E46b1Dcd58d585214F39"
  },
  {
    "name": "gAAPL-FEED",
    "address": "0x512687c7Ef205789b8106b21B05E5B0A2fa30417"
  },
  {
    "name": "gGOOGL-FEED",
    "address": "0x91668d3d691a837898c829D65566fC3846c53887"
  },
  {
    "name": "gMETA-FEED",
    "address": "0x435bA06792d6199E84A366653aA75a8be82a1ECA"
  },
  {
    "name": "gMSFT-FEED",
    "address": "0xACb9e812e1d15a7beFD76b3c436f29D6e69fC2d6"
  },
]

export type GAsset = {
  name: string,
  desc: string,
  address: string,
  feedAddress: string,
  price?: number,
  type: string,
  image?: string,
  decimals: number,
}