import { ethers } from "hardhat";
import { saveDeployAddress } from "../utils/info";

export async function deployGrandOracle() {
  let signerAddy = (await ethers.getSigners())[0].address;
  const grandOracle = await ethers.deployContract("GrandOracle", [signerAddy]);
  let deployedGrandOracle = await grandOracle.waitForDeployment();
  saveDeployAddress("GrandOracle", deployedGrandOracle.target.toString());
}