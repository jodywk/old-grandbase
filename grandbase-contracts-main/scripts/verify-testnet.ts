import { getDeployFilteredInfo, setNetwork } from "./utils/info";
import { verifyContract } from "./utils/helper";

import { _PoisonPerBlock, _bonusEndBlock } from "./deploys/deployMasterGrand";
import { _maxCollateral, _minCollateral, feeCollector } from "./deploys/deployPotionVault";
import { verifyGTokens } from "./verfies/verifyGTokens";
import { verifyFaucet } from "./verfies/verifyFaucet";
import { ethers } from "hardhat";

async function main() {
  setNetwork("baseSepolia");

  // let ownerAddy = (await ethers.getSigners())[0].address;
  // let grandAddress = getDeployFilteredInfo("Grand").address;
  // await verifyContract("Grand", grandAddress, "contracts/Grand.sol:Grand", []);

  // let grandBaseAddress = getDeployFilteredInfo("GrandBase").address;
  // await verifyContract("GrandBase", grandBaseAddress, "contracts/GrandBase.sol:GrandBase", []);

  // // let xGrandAddress = getDeployFilteredInfo("xGrand").address;
  // // await verifyContract("xGrand", xGrandAddress, "contracts/xGrand.sol:XGrand", [grandAddress]);

  // // let oracleAddress = getDeployFilteredInfo("GrandOracle").address;
  // //await verifyContract("GrandOracle", oracleAddress, "contracts/GrandOracle.sol:GrandOracle", [ownerAddy]);

  let potionVaultAddress = getDeployFilteredInfo("PotionVault").address;
  await verifyContract("PotionVault", potionVaultAddress, "contracts/PotionVault.sol:PotionVault", [_maxCollateral, _minCollateral, feeCollector]);

  // // let masterGrandAddress = getDeployFilteredInfo("MasterGrand").address;
  // // await verifyContract("MasterGrand", masterGrandAddress, "contracts/MasterGrand.sol:MasterGrand", [grandAddress, _PoisonPerBlock, _bonusEndBlock]);

  await verifyGTokens();

  // // verify for testnet
  await verifyFaucet();


  let gCoinFeedAddy = getDeployFilteredInfo("gCOIN-FEED").address;
  await verifyContract("gCOIN-FEED", gCoinFeedAddy, "contracts/Testnet/PriceFeed.sol:EACAggregatorProxy", []);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
