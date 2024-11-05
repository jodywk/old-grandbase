import axios from 'axios';
import BigNumber from 'bignumber.js';
import { getAllCollaterals } from '../controllers/collaterals.controller';
// import { COLLATERALS } from '../common/data_';

import PRICE from "../models/prices.model";
import { getAllSynAssets } from '../controllers/assets.controller';

export let LATEST_PRICE_DATA: Record<string, number> = {};
const PRICE_DECIMALS = 8;

export const updatePricesInBackground = async () => {
  let oracleServerUrl = process.env.ORACLE_SERVICE_URL;
  let priceUpdateTime = Number(process.env.PRICE_UPDATE_TIME_MS);
  if (!oracleServerUrl) {
    console.error("Please set Oracle Server Url!");
    process.exit(0);
  }
  if (isNaN(priceUpdateTime)) {
    priceUpdateTime = 24 * 60 * 60 * 1000; // every 1 day
  }

  console.log("Running Price Update service");

  let url = `${oracleServerUrl}/service/v1/data/prices`;

  const updatePrice = async () => {
    try {
      let pricesData: Record<string, string> = (await axios.get(url)).data.data;
      Object.entries(pricesData).forEach(([k, v], idx) => {
        LATEST_PRICE_DATA[k] = new BigNumber(v).div(Math.pow(10, PRICE_DECIMALS)).toNumber();
      })

      // add stable coin prices. always 1 for test
      let collaterals = await getAllCollaterals();
      collaterals.forEach(c => {
        LATEST_PRICE_DATA[c.address ?? ""] = 1;
      })

      console.log(LATEST_PRICE_DATA);
      console.log("Prices updated!");

      // update db
      await updatePriceDb();
    } catch (e: any) {
      console.error("Oracle Service is not responding");
    }
  }

  // to update price immediately
  await updatePrice();
  setInterval(async () => {
    await updatePrice();
  }, priceUpdateTime)
}

// insert new price history to db
export const updatePriceDb = async () => {
  
  let nowTime = parseInt((Date.now() / 1000).toFixed(0));
  let latestPrice = await PRICE.findOne({
    order: [['timestamp', 'DESC']] 
  });

  if (latestPrice && latestPrice.timestamp) {
    // if time passed 1 day, then add new price history
    // if not, then don't update the price
    if (nowTime < 86000 + latestPrice.timestamp) {
      return;
    }
  }

  let newHistory: any[] = [];
  let synAssets = await getAllSynAssets();

  Object.entries(LATEST_PRICE_DATA).forEach(([addy, price], idx) => {
    let asset = synAssets.find((asset) => asset.address == addy);  
    if (asset) {
      newHistory.push({
        name: asset.name,
        address: asset.address,
        price: price,
        timestamp: nowTime
      })
    }
  })

  
  await PRICE.bulkCreate(newHistory);
  console.log("inserted new prices in db");
}