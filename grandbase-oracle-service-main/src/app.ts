import app from './server'
import dotenv from 'dotenv'

import Database from './db';
import { oracleService } from './service/oracle';

async function main(): Promise<void> {
  dotenv.config()
  const port = process.env.PORT ?? 3000

  // setup database
  // let _db = new Database();
  // await _db.initDatabase(); // only for db setup

  try {
    app.listen(port, () => {
      console.log('Grandbase Oralce Service running on port : ' + port)
    })
  } catch (e) {
    console.error(e)
    // process.exit(1)
  }

  try {
    oracleService();
  } catch (e) {
    console.log("Error while reading prices: ", e);
  }
}
main().catch(console.error)
