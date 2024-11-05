import { ethers } from "hardhat";
import { saveDeployAddress } from "../utils/info";
import { gTokenInfos } from "../utils/gassets";
export async function deployFeeds() {
  let signerAddy = (await ethers.getSigners())[0].address;
  for (let i = 0; i < gTokenInfos.length; i++) {
    if (gTokenInfos[i].symbol) {
      const aggregatorProxy = await ethers.deployContract("EACAggregatorProxy", []);
      let deployedAggregator = await aggregatorProxy.waitForDeployment();
      saveDeployAddress(gTokenInfos[i].symbol + "-FEED", deployedAggregator.target.toString());
    }
  }
}
