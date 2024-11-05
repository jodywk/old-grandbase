import { type Request, type Response, type NextFunction } from 'express'
import PotionVaultAbi from "../abis/PotionVault.json";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import { ethers } from 'ethers';
import { cvt2UiAmount } from '../common/utils';
import { getAllCollaterals } from './collaterals.controller';
import { getAllSynAssets } from './assets.controller';
import Collateral from '../models/collaterals.model';
import SynAsset from '../models/syn-assets.model';
import { getPrices } from './resource.controller';
import { LATEST_PRICE_DATA } from '../service/priceUpdateService';
import { getAllContracts } from './contracts.controller';

let provider = ethers.getDefaultProvider(process.env.RPC_URL);
let oracleServerUrl = process.env.ORACLE_SERVICE_URL;
const multicall = new Multicall({ ethersProvider: provider as any, tryAggregate: true, multicallCustomContractAddress: "0xB206027a9E0E13F05eBEFa5D2402Bab3eA716439" });

export async function api_getAll(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    let vaults = await getLiquidationVaults();
    res.send({
      data: vaults
    });
  } catch (err: any) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving contracts."
    });
  }
}

export const getLiquidationVaults = async (): Promise<Array<VaultType>> => {
  let contracts = await getAllContracts();
  let vaultContractAddy = contracts.find(c => c.name === "PotionVault")!.address;

  if (!vaultContractAddy) return [];

  const signer = new ethers.Wallet("", provider);
  const contract = new ethers.Contract(vaultContractAddy, PotionVaultAbi.abi, signer);

  let vaultsToLiquidate = await contract.getLiquidationSafes();

  return vaultsToLiquidate;
}

export type VaultType = {
  id: number,
  walletAddress: string,
  collateralAmount: string,
  mintAmount: string,
  lastInteractionTime: number,
  stableTokenId: number,
  synTokenId: number
}
