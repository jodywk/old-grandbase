import { ethers } from "hardhat";
import fs from "fs";
import { getDeployFilteredInfo, saveDeployAddress } from "../utils/info";

export async function deployGrandBase() {
    const grand = await ethers.deployContract("GrandBase");
    let deployedGrand = await grand.waitForDeployment();
    console.log("deployed: ", deployedGrand.target.toString())
    saveDeployAddress("GrandBase", deployedGrand.target.toString())
}