import { ethers } from "hardhat";
import fs from "fs";
import { getDeployFilteredInfo, saveDeployAddress, filterTokensByName } from "../utils/info";
import { gTokenInfos } from "../utils/gassets";
import { faucetTokens } from "../deploys/deployFaucet";

export const _maxCollateral = "1000000000000000000000000000000";
export const _minCollateral = "0";
export const feeCollector = "0x598264FF31f198f6071226b2B7e9ce360163aCcD"

export async function deployPotionVault() {
  // const oracleAddy = getDeployFilteredInfo("GrandOracle").address;

  const _contract = await ethers.deployContract("PotionVault", [_maxCollateral, _minCollateral, feeCollector/*, oracleAddy*/]);
  let deployed = await _contract.waitForDeployment();
  saveDeployAddress("PotionVault", deployed.target.toString());
}

export async function setAssetsAndTokensInPotionVault() {
  const [deployer] = await ethers.getSigners();
  const artifactsPath = "artifacts/contracts/PotionVault.sol/PotionVault.json";
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  const abi = contractArtifact.abi;
  const contract = new ethers.Contract(getDeployFilteredInfo("PotionVault").address, abi, deployer);
  // call addSynToken for all gTokenInfos - addSynToken(IGToken _synToken, address _oracle, bool _canMint, bool _nasdaqTimer, uint _minCratio)
  for (let i = 0; i < gTokenInfos.length; i++) {
    if (gTokenInfos[i].symbol) {
      const gTokenAddr = filterTokensByName(gTokenInfos[i].symbol)[0].address;
      console.log("addSynToken", gTokenAddr);
      let nasdaqTimer = true;
      // for test, make it false
      nasdaqTimer = false;
      let minCratio = 15000000000;
      if (gTokenInfos[i].symbol === "gGOLD" ||
        gTokenInfos[i].symbol === "gSLVR" ||
        gTokenInfos[i].symbol === "gOil") {
        nasdaqTimer = false;
        minCratio = 13000000000;
      }

      let feedAddr = getDeployFilteredInfo(gTokenInfos[i].symbol + "-FEED").address;
      await contract.addGToken(
        gTokenAddr,
        feedAddr /* instead of oracle */,
        true,
        nasdaqTimer,
        minCratio,
        minCratio + 1000000000,
        minCratio + 1500000000,

      );
    }
  }

  // call addStableToken for all stableTokens ( faucetTokens ) - addStableToken(IERC20 _stableToken, uint256 _underlyingContractDecimals, bool _canMint)
  for (let i = 0; i < faucetTokens.length; i++) {
    if (faucetTokens[i].name) {
      const fTokenAddr = filterTokensByName(faucetTokens[i].name)[0].address;
      const artifactsPathFaucet = "artifacts/contracts/Testnet/FaucetToken.sol/FaucetToken.json";
      const contractArtifactFaucet = JSON.parse(fs.readFileSync(artifactsPathFaucet, "utf8"));
      const abiFaucet = contractArtifactFaucet.abi;
      const contractFaucet = new ethers.Contract(fTokenAddr, abiFaucet, deployer);
      const decimals = await contractFaucet.decimals();
      const underlyingContractDecimals = 10 ** (18 - Number(decimals));

      // console.log("addStableToken", fTokenAddr, underlyingContractDecimals.toLocaleString('fullwide', {useGrouping:false}));
      await contract.addCollateralToken(fTokenAddr, underlyingContractDecimals.toLocaleString('fullwide', { useGrouping: false }), true);
    }
  }
}