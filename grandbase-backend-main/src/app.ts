import app from './server'
import dotenv from 'dotenv'

import Database from './db';
import { updatePricesInBackground } from "./service/priceUpdateService";

async function main(): Promise<void> {
  dotenv.config()
  const port = process.env.PORT ?? 3000

  // setup database
  let _db = new Database();
  await _db.initDatabase(); // only for db setup

  try {
    updatePricesInBackground();
    app.listen(port, () => {
      console.log('Grandbase Backend running on port : ' + port)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
main().catch(console.error)
