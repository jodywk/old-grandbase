const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Deploying contract with the account: ${owner.address}`);
    console.log(`Account Balance: ${(await owner.getBalance()).toString()} ETH`);

    const tokenFactory = await ethers.getContractFactory("MockToken");
    const tokenContract = await tokenFactory.deploy()
    await tokenContract.deployed();

    console.log(`Token contract deployed to: ${tokenContract.address}`);
}

main().catch( err => {
    console.error(err);
    process.exitCode = 1;
})