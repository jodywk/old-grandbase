import { useContext, useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import GBToken from '../_assets/gbToken.png';
import EthIcon from "./Icons/EthIcon";
import BaseIcon from './Icons/BaseIcon';
import SwapIcon from './Icons/SwapIcon';
// import ApproveButton from './ApproveButton';
// import ClaimButton from './ClaimButton';
import CustomButton from './CustomButton';
import MaxButton from './MaxButton';
import GlobalWeb3Context from '../../_context/GlobalWeb3Context';
import { fetchAllowance, fetchDstGBBalance, fetchGBBalance } from '../../hooks/useContractData';
import { DST_CHAIN_ID, LAYERZERO_SCAN_URL, SRC_CHAIN_ID } from '../../config/constants';
import { numberWithCommas } from '../../utils';

const SwapSection = () => {
  const chainId = useChainId();
  const { txLoading, approve, bridgeToken } = useContext(GlobalWeb3Context);
  const { address:walletAddress } = useAccount();
  const { openConnectModal } = useConnectModal()
  
  const [ethVal, setEthVal] = useState('');
  const [baseVal, setBaseVal] = useState(0);
  const [flag, setFlag] = useState(0);
  const [isClaimed, setIsClaimed] = useState(false);
  const [lastTxHash, setLastTxHash] = useState('');
  
  const { allowance, getAllowance } = fetchAllowance();
  const { gbBalance:srcGbBalance, getGBBalance:getSrcGBBalance } = fetchGBBalance();
  const { dstGbBalance, getDstGBBalance } = fetchDstGBBalance();
  
  useEffect(() => {
    if (walletAddress) {
      getSrcGBBalance(SRC_CHAIN_ID, walletAddress);
      getDstGBBalance(DST_CHAIN_ID, walletAddress);

      getAllowance(chainId, walletAddress);
    }
  }, [chainId, walletAddress, flag])

  const handleInputChange = (e) => {
    setEthVal(e.target.value);
    setBaseVal(e.target.value);
  };

  const onClickApprove = async () => {
    console.log('handle click approve button');
    console.log("onClickApprove: approve Amount=", Number(ethVal));
    if(Number(ethVal) == 0) return;
    await approve(Number(ethVal));
    setFlag(flag + 1);
  }

  const onClickClaim = async () => {
    console.log('handle click claim button.');
    console.log("onClickClaim: claim amount=", Number(ethVal));
    if(Number(ethVal) == 0) return;
    const txHash = await bridgeToken(Number(ethVal));
    console.log("txHash=", txHash);
    if(txHash == null) return;
    setFlag(flag + 1);
    setLastTxHash(txHash)
    setIsClaimed(true);
  };

  const handleClickETHMax = () => {
    setEthVal(srcGbBalance);
    setBaseVal(srcGbBalance);
  };

  const renderButton = () => {
    if(!walletAddress) {
      return <CustomButton title="Connect Wallet" onClick={openConnectModal} />
    }
    let isDisabled = ethVal == 0;
    
    return (
      Number(allowance) >= Number(ethVal) ?
        <CustomButton title="Claim" isDisabled={isDisabled} onClick={onClickClaim} />
        :
        <CustomButton title="Approve" isDisabled={isDisabled} onClick={onClickApprove} />
    )
  }

  return (
    <div className="border-white/10 text-white border rounded-3xl flex bg-white/5 flex-col gap-5 sm:gap-10 w-full sm:w-[700px] mx-auto p-4">
      <p className="text-center text-lg pt-3 sm:pt-4">Token Bridge</p>
      <div className="p-2 sm:p-4 grid grid-cols-3 gap-2 sm:gap-4 bg-white/5 rounded-2xl">
        <div className="space-y-4">
          <p className="text-white/70 px-2 text-sm">From</p>
          <div className="px-1 sm:px-2 py-4 sm:p-4 bg-white/10 rounded-2xl border border-white/10 flex gap-x-1 sm:gap-x-3 text-sm items-center">
            <EthIcon /> ETH
          </div>
        </div>
        <div className="col-span-2 ">
          <div className="space-y-4">
            <p className="text-right text-white/70 px-2 text-sm">{`Balance: ${numberWithCommas(srcGbBalance, 2)}`}</p>
            <div className="py-[11px] sm:py-3 bg-white/10 px-1 sm:px-2 rounded-2xl flex items-center gap-x-2 border border-white/10">
              <MaxButton onClick={handleClickETHMax} />
              <input
                type="number"
                name="ethVal"
                placeholder="0"
                value={ethVal}
                onChange={(e) => handleInputChange(e)}
                className="border-none bg-transparent flex flex-1 text-right min-w-0 focus:outline-none placeholder:text-white"
              />
              <div className="overflow-hidden rounded-full w-5 h-5 shrink-0">
                <img className="object-cover h-full" src={GBToken.src} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SwapIcon />
      <div className="p-2 sm:p-4 grid grid-cols-3 gap-2 sm:gap-4 bg-white/5 rounded-2xl">
        <div className="space-y-4">
          <p className="text-white/70 px-2 text-sm">To</p>
          <div className="px-1 sm:px-2 py-4 sm:p-4 bg-white/10 rounded-2xl border border-white/10 flex gap-x-1 sm:gap-x-3 items-center text-sm">
            <div className="rounded-full w-6 h-6 sm:h-8 sm:w-8 overflow-hidden shrink-0">
              <BaseIcon />
            </div>
            BASE
          </div>
        </div>
        <div className="col-span-2 ">
          <div className="space-y-4">
            <p className="text-right text-white/70 px-2 text-sm">{`Balance: ${numberWithCommas(dstGbBalance, 2)}`}</p>
            <div className="py-[11px] sm:py-3 bg-white/10 px-1 sm:px-2 rounded-2xl flex items-center gap-x-2 border border-white/10">
              <MaxButton />
              <input
                type="text"
                value={baseVal}
                className="border-none bg-transparent flex flex-1 text-right min-w-0 focus:outline-none"
                disabled
              />
              <div className="overflow-hidden rounded-full w-5 h-5 shrink-0">
                <img className="object-cover h-full" src={GBToken.src} />
              </div>
            </div>
          </div>
        </div>
      </div>
      { renderButton() }
      {isClaimed && <div className="px-2">
        TxHash: 
        <a href={`${LAYERZERO_SCAN_URL[chainId]}/tx/${lastTxHash}`} target="_blank" className="break-words pl-4">
          {`${LAYERZERO_SCAN_URL[chainId]}/tx/${lastTxHash}`}
        </a>
      </div>}
    </div>
  );
};

export default SwapSection;
