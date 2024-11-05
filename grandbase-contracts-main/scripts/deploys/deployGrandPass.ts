import { ethers } from "hardhat";
import fs from "fs";
import { getDeployFilteredInfo, saveDeployAddress, filterTokensByName } from "../utils/info";

export async function deployGrandPass() {
//   let _uri = "https://tomato-cheap-otter-828.mypinata.cloud/ipfs/QmfBMpdYTPyXjizZFnQUa39b1y2TqQsGcGcxmw8a4Bdghw/{id}.json";
//   let _baseUri = "https://tomato-cheap-otter-828.mypinata.cloud/ipfs/QmfBMpdYTPyXjizZFnQUa39b1y2TqQsGcGcxmw8a4Bdghw/";
    let _uri = "https://tomato-cheap-otter-828.mypinata.cloud/ipfs/QmSeYHHByT2QFFg68BMcTaTLcYiWgnGij8PrkiCY3mtDEN/{id}.json";
    // let _baseUri = "https://tomato-cheap-otter-828.mypinata.cloud/ipfs/QmSeYHHByT2QFFg68BMcTaTLcYiWgnGij8PrkiCY3mtDEN/";
    let _baseUri = "https://tomato-cheap-otter-828.mypinata.cloud/ipfs/QmZyBjQZSqb2JMsVMekTVW4wnS2eoHFXf16ibD2nYbqGwd";
    console.log(">>>>>>>>>>>>>>>>>>>>", _uri)
  const _contract = await ethers.deployContract("GrandPass", [_uri, _baseUri]);
//   console.log(">>>>>>contract=", _contract);
  let deployed = await _contract.waitForDeployment();
  saveDeployAddress("GrandPass", deployed.target.toString());
}
