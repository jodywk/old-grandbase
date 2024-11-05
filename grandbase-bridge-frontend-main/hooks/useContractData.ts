import { useState, useCallback } from 'react'
import { readContract } from '@wagmi/core'
import Web3 from 'web3'
import { erc20ContractABI } from '../config/abi/ERC20ABI'
import { DST_RPC_URL, GBMIGRATOR_CONTRACT_ADDRESS, GBTOKEN_ADDRESS } from '../config/constants';

export const fetchGBBalance = () => {
    const [ gbBalance, setGBBalance ] = useState(0);
    const getGBBalance = useCallback(async(chainId, address) => {
        if(address) {
            try {
                const data = await readContract({
                    address: GBTOKEN_ADDRESS[chainId] as `0x${string}`,
                    abi: erc20ContractABI,
                    functionName: 'balanceOf',
                    args: [address as `0x${string}`]
                })
                setGBBalance(Number(data) / (10 ** 18));
            } catch(err) {
                console.error('Error fetching contract data:', err);
            }
        }
    }, []);

    return { gbBalance, getGBBalance }
}

export const fetchDstGBBalance = () => {
    const [ dstGbBalance, setDstGbBalance ] = useState(0);
    const getDstGBBalance = useCallback(async(chainId, address) => {
        if(address) {
            try {
                console.log("getDstGBBalance: chainId=", chainId, DST_RPC_URL[chainId])
                const web3 = new Web3(DST_RPC_URL[chainId]);
                const tokenContract = new web3.eth.Contract(erc20ContractABI, GBTOKEN_ADDRESS[chainId]);
                const data = await tokenContract.methods.balanceOf(address).call();
                console.log("getDstGBBalance: balance=", data)
                setDstGbBalance(Number(data) / (10 ** 18));
            } catch(err) {
                console.error('Error fetching contract data:', err);
            }
        }
    }, []);
    return { dstGbBalance, getDstGBBalance }
}

export const fetchAllowance = () => {
    const [allowance, setAllowance] = useState(0);
    const getAllowance = useCallback(async (chainId, address) => {
        if (address) {
            try {
                const data = await readContract({
                    address: GBTOKEN_ADDRESS[chainId] as `0x${string}`,
                    abi: erc20ContractABI,
                    functionName: 'allowance',
                    args: [address as `0x${string}`, GBMIGRATOR_CONTRACT_ADDRESS[chainId] as `0x${string}`],
                });

                setAllowance(Number(data) / (10 ** 18));
            } catch (error) {
                console.error('Error fetching contract data:', error);
            }
        }
    }, []);

    return { allowance, getAllowance };
};