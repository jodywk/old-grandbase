import { ethers } from "hardhat";
import fs from "fs";
import { getDeployFilteredInfo, saveDeployAddress, filterTokensByName } from "../utils/info";

export const _PoisonPerBlock = "10000000000000";
export const _bonusEndBlock = 0;

export async function deployMasterGrand() {
  let grandAddress = getDeployFilteredInfo("Grand").address;

  const _contract = await ethers.deployContract("MasterGrand", [grandAddress, _PoisonPerBlock, _bonusEndBlock]);
  let deployed = await _contract.waitForDeployment();
  saveDeployAddress("MasterGrand", deployed.target.toString());
}

export async function addPoolsToMaster() {
  // call addPool after getting lp token addresses
  //     function addPool( uint256 _allocPoint, IERC20 _lpToken, bool _withUpdate )
  // _allocPoint = 100 / lp count
  // _withUpdate = always true
  const [deployer] = await ethers.getSigners();
  const artifactsPath = "artifacts/contracts/MasterGrand.sol/MasterGrand.json";
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  const abi = contractArtifact.abi;
  const contract = new ethers.Contract(getDeployFilteredInfo("MasterGrand").address, abi, deployer);
  const lps = filterTokensByName("BaseSwap LPs");
  for (let i = 0; i < lps.length; i++) {
    
    await contract.addPool(Math.floor(100 / lps.length), lps[i].address, true);
    console.log("added a Pool for ", lps[i].name, lps[i].address);
  }
}