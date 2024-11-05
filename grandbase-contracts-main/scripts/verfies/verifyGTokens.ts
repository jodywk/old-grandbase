import { getDeployFilteredInfo, setNetwork } from "../utils/info";
import { verifyContract } from "../utils/helper";
import { gTokenInfos } from "../utils/gassets";

export async function verifyGTokens() {

  setNetwork("baseSepolia");
  let token = gTokenInfos[0];
  let tokenAddress = getDeployFilteredInfo(token.symbol).address;

  console.log("token =", token, tokenAddress);
  await verifyContract(token.symbol, tokenAddress, "contracts/Testnet/GToken.sol:GToken", [token.name, token.symbol]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
verifyGTokens().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
