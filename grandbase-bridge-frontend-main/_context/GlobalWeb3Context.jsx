import React, { useState } from 'react'
import { useAccount, useChainId } from 'wagmi';

import { showToast } from '../utils';
import { web3_approve, web3_bridgeToken } from '../hooks/writeContractData';
import { DST_LAYERZERO_ID, GBMIGRATOR_CONTRACT_ADDRESS } from '../config/constants';

const GlobalWeb3Context = React.createContext({
    txLoading: false,
    loadingMsg: "",
    chainId: 1,
    approve: async(amount) => {},
    bridgeToken: async(amount) => {},
})

export const GlobalWeb3Provider = ({ children }) => {
    const chainId = useChainId()
    const { address: walletAddress } = useAccount();
    const [txLoading, setTxLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");

    const approve = async(amount) => {
        setTxLoading(true);
        try {
            setLoadingMsg(`Approving ${amount} GB...`);
            console.log(`Approving ${amount} GB from ${walletAddress}`)
            let approveTxHash = await web3_approve(chainId, GBMIGRATOR_CONTRACT_ADDRESS[chainId], amount);
            console.log("approveTxHash:", approveTxHash)
            showToast("s", `Approved ${amount} GB!`)
        } catch(err) {
            console.log(err);
            if(err.message && err.message.includes("User denined transaction signature")) {
                showToast('e', 'Tx signature denied!');
            } else {
                showToast('e', `Approving GB failed!`);
            }
        }
        setTxLoading(false);
    }

    const bridgeToken = async(amount) => {
        setTxLoading(true);
        try {
            setLoadingMsg(`Bridging ${amount} GB...`);
            console.log(`Bridging ${amount} GB from ${walletAddress}`)
            let txHash = await web3_bridgeToken(chainId, amount, walletAddress, DST_LAYERZERO_ID);
            setTxLoading(false);
            showToast('s', 'Please check the tx to be confirmed!')
            return txHash;
        } catch(err) {
            console.log(err);
            if(err.message && err.message.includes("User denined transaction signature")) {
                showToast('e', 'Tx signature denied!');
            } else {
                showToast('e', `Bridging GB token failed!`);
            }
        }
        setTxLoading(false);
        return null
    }
    
    return <GlobalWeb3Context.Provider value={{chainId, txLoading, loadingMsg, approve, bridgeToken}}>{children}</GlobalWeb3Context.Provider>
}

export default GlobalWeb3Context;