import { prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core"
import { GBMIGRATOR_CONTRACT_ADDRESS, GBTOKEN_ADDRESS } from "../config/constants"
import { gbMigratorContractABI } from "../config/abi/GBMigratorABI"
import { erc20ContractABI } from "../config/abi/ERC20ABI";

export const web3_approve = async(chainId, spender, amount) => {
    try {
        const approveAmount:any = amount * Math.pow(10, 18);
        const config = await prepareWriteContract({
            address: GBTOKEN_ADDRESS[chainId] as `0x${string}`,
            abi: erc20ContractABI,
            functionName: 'approve',
            args: [spender, approveAmount]
        })
        let txRes = await writeContract(config);
        let res = await waitForTransaction(txRes);
        return res.transactionHash;
    } catch(err) {
        console.log("Approve err", err);
        throw "Approve Failed"
    }
}

export const web3_bridgeToken = async(srcChainId, amount, receiver, dstChainId) => {
    try {
        const sendAmount = amount * Math.pow(10, 18);
        console.log("Migrator:", GBMIGRATOR_CONTRACT_ADDRESS[srcChainId])
        console.log("web3_bridgeToken Args:", srcChainId, sendAmount, receiver, sendAmount, dstChainId)
        const config = await prepareWriteContract({
            address: GBMIGRATOR_CONTRACT_ADDRESS[srcChainId] as `0x${string}`,
            abi: gbMigratorContractABI,
            functionName: 'bridgeToken',
            args: [sendAmount, receiver, sendAmount, dstChainId]
        })
        let txRes = await writeContract(config);
        let res = await waitForTransaction(txRes);
        return res.transactionHash
    } catch(err) {
        console.log("err", err)
        throw "Bridging Failed"
    }
}
