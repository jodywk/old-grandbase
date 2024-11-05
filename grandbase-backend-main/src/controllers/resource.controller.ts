import { type Request, type Response, type NextFunction } from 'express'
import { LATEST_PRICE_DATA } from '../service/priceUpdateService';
import { getAllCollaterals } from './collaterals.controller';
import { getAllSynAssets } from './assets.controller';
import { getAllLps } from './masterlps.controller';
import { getAllContracts } from './contracts.controller';

import PriceModel from '../models/prices.model';

export async function getAll(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  let collaterals = await getAllCollaterals();
  let assets = await getAllSynAssets();
  let lps = await getAllLps();
  let contracts = await getAllContracts();

  res.status(200).send({
    success: true,
    data: {
      collateral: collaterals,
      assets: assets,
      lps: lps,
      contracts: contracts
    }
  });
}

export async function getPrices(
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<any> {
  
  let priceAns: Record<string, Object> = {};

  await Promise.all(Object.entries(LATEST_PRICE_DATA).map(async ([addy, price]) => {

    let res = await PriceModel.findAll({
      attributes: ['price'],
      order: [['timestamp', 'DESC']],
      limit: 5,
      where: {
        address: addy
      }
    });

    let priceHistory = res.map(r => r.price ?? 0);
    let prevPrice = priceHistory[1] ?? priceHistory[0];
    let variation = (price - prevPrice) / prevPrice * 100;

    console.log("prevPrice =", prevPrice)
    
    priceAns[addy] = {
        price,
        priceHistory: priceHistory.reverse(), // Order by ASC
        variation
    };

  }));


  res.status(200).send({
    success: true,
    data: priceAns
  });
}