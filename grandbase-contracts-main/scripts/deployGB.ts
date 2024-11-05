import { ethers } from "hardhat";

import { setNetwork } from "./utils/info";
import { deployGrandBase } from "./deploys/deployGrandBase";

async function main() {
  setNetwork("base");
  await deployGrandBase();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
