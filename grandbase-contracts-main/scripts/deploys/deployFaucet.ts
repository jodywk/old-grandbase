import { ethers } from "hardhat";
import { saveDeployAddress } from "../utils/info";

export const faucetTokens = [{
  name: "Grandbase Faucet USDC",
  symbol: "USDC",
  decimals: 6
}/*, {
  name: "Grandbase Faucet USDT",
  symbol: "USDT",
  decimals: 6
}, {
  name: "Grandbase Faucet DAI",
  symbol: "DAI",
  decimals: 18
}*/];

export async function deployFaucet() {
  const faucet = await ethers.deployContract("Faucet");
  let deployedFaucet = await faucet.waitForDeployment();
  saveDeployAddress("Faucet", deployedFaucet.target.toString());

  let faucetAddress = deployedFaucet.target.toString();

  for (let token of faucetTokens) {
    const faucetToken = await ethers.deployContract("FaucetToken", [
      faucetAddress, token.name, token.symbol, token.decimals
    ]);
    let deployedToken = await faucetToken.waitForDeployment();
    saveDeployAddress(token.name, deployedToken.target.toString());
    await faucet.mint(deployedToken.target.toString(), token.symbol === "DAI" ? "10000000000000000000000000000" : "10000000000000");
  }
}
