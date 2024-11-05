import { ethers } from "hardhat";
import { getDeployFilteredInfo, saveDeployAddress } from "../utils/info";

export async function deployXGrand() {
  let grandAddress = getDeployFilteredInfo("Grand").address;
  console.info("grandAddress ==", grandAddress);
  
  const _contract = await ethers.deployContract("XGrand", [grandAddress]);
  let deployed = await _contract.waitForDeployment();
  saveDeployAddress("xGrand", deployed.target.toString());
}
