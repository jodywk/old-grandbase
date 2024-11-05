const shell = require('shelljs')
const {TEST_CHAINS, CHAINS} = require('../constants/networks');

module.exports = async function (taskArgs, hre) {
    let localContract, remoteContract;
    let networks;
    if (taskArgs.task == "test") {
        networks = TEST_CHAINS;
    } else {
        networks = CHAINS;
    }

    // deploy contract    
    for (let i = 0; i< networks.length; i++) {
        let network = networks[i];
        console.log(`deploying ${taskArgs.contract} to chain ${network}`)
        const deployCommand = `hardhat --network ${network} deploy --tags ${taskArgs.contract}`;
        console.log("   Command: " + deployCommand)
        try {
            const result = await shell.exec(deployCommand)
            if (result.code != 0) {
                return;
            }
        } catch (e) {
            return;
        }
    }
}
