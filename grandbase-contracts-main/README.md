## GrandBase Contracts

* Grand
* xGrand
* PotionVault
* MasterGrand

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts --network baseGoerli
npx hardhat run scripts/deploy-testnet.ts --network baseSepolia
npx hardhat run scripts/verify.ts --network baseGoerli
```

## Todos
- deployGrand.ts/setMasterToAuthForGrand
- deployGTokens.ts/setGTokenAuths
- deployMasterGrand.ts/addPoolsToMaster
- deployPotionVault.ts/setAssetsAndTokensInPotionVault

## Resources
- gAssets
  > utils/gassets.ts/gTokenInfos
- collaterals

  Now, let's use faucet tokens as collaterals
  > deploys/deployFaucet.ts/faucetTokens
- lps
  > utils/gassets.ts/TestLPs

## Connections (for test)
- When gTokens are changed
* redeploy potionVault
* deployGtokens
* setGTokensAuth
* setAssetsAndTokensInPotionVault