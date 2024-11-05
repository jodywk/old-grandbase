import { ethers } from "hardhat";
import { deployGrand, setMasterAsAuthForGrand } from "./deploys/deployGrand";
import { deployXGrand } from "./deploys/deployXGrand";
import { addPoolsToMaster, deployMasterGrand } from "./deploys/deployMasterGrand";
import { deployPotionVault, setAssetsAndTokensInPotionVault } from "./deploys/deployPotionVault";
import { deployGTokens, mintGTokens, setGTokensAuth } from "./deploys/deployGTokens";
import { setNetwork } from "./utils/info";
import { deployFaucet } from "./deploys/deployFaucet";
import { deployLPs } from "./deploys/deployLPs";
import { deployGrandOracle } from "./deploys/deployOracle";
import { deployGrandBase } from "./deploys/deployGrandBase";
import { deployFeeds } from "./deploys/deployFeeds";

async function main() {
  setNetwork("baseSepolia");

  //await deployGrandBase();
  await deployPotionVault();
  //await deployGTokens();
  //await deployFaucet();
  // // add synToken(gAsset) and stableTokens(Collateral)
  //await deployFeeds();
  // // set PotionVault as an authorized minter/burner of gTokens
  await setGTokensAuth();
  await setAssetsAndTokensInPotionVault();
  // await mintGTokens();
}

// PotionVault - gTokens(setAssetsAndTokensInPotionVault), 
// GToken - PotionVault

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
