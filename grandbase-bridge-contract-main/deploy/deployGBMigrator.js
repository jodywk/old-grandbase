const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const GB_TOKENS = require("../constants/gbTokens.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    const gbTokenAddress = GB_TOKENS[hre.network.name]
    console.log(`[${hre.network.name}] LayerZero Endpoint address: ${lzEndpointAddress}, GBToken: ${gbTokenAddress}`)

    await deploy("GBMigrator", {
        from: deployer,
        args: [lzEndpointAddress, gbTokenAddress],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["GBMigrator"]
