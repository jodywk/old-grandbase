import { ethers } from "hardhat";
import fs from "fs";
import { getDeployFilteredInfo, saveDeployAddress, filterTokensByName, setNetwork } from "../utils/info";
import { gTokenInfos } from "../utils/gassets";

export async function deployGTokens() {
  for (let token of gTokenInfos) {
    const grand = await ethers.deployContract("GToken", [token.name, token.symbol]);
    let deployed = await grand.waitForDeployment();
    saveDeployAddress(token.symbol, deployed.target.toString());
    // if (token.symbol == 'gGLXY') break;
  }
}

export async function setGTokensAuth() {
  // call setAuth(PotionVault address) for all deployed gTokenInfos
  const [deployer] = await ethers.getSigners();
  const artifactsPath = "artifacts/contracts/GToken.sol/GToken.json";
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  const abi = contractArtifact.abi;
  for (let i = 0; i < gTokenInfos.length; i++) {
    if (gTokenInfos[i].symbol) {
      const gTokenAddr = filterTokensByName(gTokenInfos[i].symbol)[0].address;
      const contract = new ethers.Contract(gTokenAddr, abi, deployer);
      // console.log("addAuthorized", gTokenAddr, getDeployFilteredInfo("PotionVault").address);
      await contract.addAuthorized(getDeployFilteredInfo("PotionVault").address);
      await contract.addAuthorized(deployer.address);
      console.log(`GToken ${gTokenInfos[i].symbol} authorized.`);

      // if (gTokenInfos[i].symbol == 'gGLXY') break;
    }
  }
}

(async () => {
  setNetwork("BaseGoerli");
  await deployGTokens().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
});


export async function mintGTokens() {
  const [deployer] = await ethers.getSigners();
  const artifactsPath = "artifacts/contracts/GToken.sol/GToken.json";
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  const abi = contractArtifact.abi;
  for (let i = 0; i < gTokenInfos.length; i++) {
    if (gTokenInfos[i].symbol) {
      const gTokenAddr = filterTokensByName(gTokenInfos[i].symbol)[0].address;
      const contract = new ethers.Contract(gTokenAddr, abi, deployer);
      await contract.mint(deployer.address, "10000000000000000000000");
      console.log(`GToken ${gTokenInfos[i].symbol} minted.`);
      // if (gTokenInfos[i].symbol == 'gGLXY') break;
    }
  }
}