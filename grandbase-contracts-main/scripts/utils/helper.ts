

import { run } from 'hardhat';

export const verifyContract = async (name: string, address: string, contractPath: string, args: any) => {
  console.info(`Verifying ${name} ...`)
  // no return
  await run('verify:verify', {
    contract: contractPath,
    address: address,
    constructorArguments: args ? [...args] : []
  })
}