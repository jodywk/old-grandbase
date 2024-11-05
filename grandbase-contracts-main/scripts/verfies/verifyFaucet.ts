import { getDeployFilteredInfo, setNetwork } from "../utils/info";
import { verifyContract } from "../utils/helper";
import { faucetTokens } from "../deploys/deployFaucet";

export async function verifyFaucet() {

  setNetwork("baseSepolia");
  let faucetAddress = getDeployFilteredInfo("Faucet").address;
  await verifyContract("Faucet", faucetAddress, "contracts/Testnet/Faucet.sol:Faucet", []);

  let fToken = faucetTokens[0];
  let faucetTokenAddress = getDeployFilteredInfo(fToken.name).address;
  await verifyContract("Faucet Tokens", faucetTokenAddress, "contracts/Testnet/FaucetToken.sol:FaucetToken", [
    faucetAddress, fToken.name, fToken.symbol, fToken.decimals
  ]);
}
