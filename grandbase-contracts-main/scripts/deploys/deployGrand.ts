import { ethers } from "hardhat";
import fs from "fs";
import { getDeployFilteredInfo, saveDeployAddress } from "../utils/info";

export async function deployGrand() {
  const grand = await ethers.deployContract("Grand");
  let deployedGrand = await grand.waitForDeployment();
  saveDeployAddress("Grand", deployedGrand.target.toString());
}

export async function setMasterAsAuthForGrand() {
  // call addAuthorized(masterGrand)
  const [deployer] = await ethers.getSigners();
  const artifactsPath = "artifacts/contracts/Grand.sol/Grand.json";
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  const abi = contractArtifact.abi;
  const contract = new ethers.Contract(getDeployFilteredInfo("Grand").address, abi, deployer);
  // console.log("addAuthorized", getDeployFilteredInfo("MasterGrand").address);
  await contract.addAuthorized(getDeployFilteredInfo("MasterGrand").address);
}