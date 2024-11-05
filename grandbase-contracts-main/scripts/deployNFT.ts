import { ethers } from "hardhat";

import { setNetwork } from "./utils/info";
import { deployGrandPass } from "./deploys/deployGrandPass";

async function main() {
  setNetwork("BaseGoerli");
  await deployGrandPass();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
