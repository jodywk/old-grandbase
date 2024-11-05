import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import config from "../config/db.config.json";

// models
import UserProfile from "../models/user-profile.model";
import Collaterals from "../models/collaterals.model";
import MasterLps from "../models/master-lps.model";
import Prices from "../models/prices.model";
import SynAssets from "../models/syn-assets.model";
import Contracts from "../models/contracts.model";

import { initDB } from "./init";

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      port: config.PORT,
      dialect: config.dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
      },
      models: [
        UserProfile,
        Collaterals,
        MasterLps,
        Prices,
        SynAssets,
        Contracts
      ]
    } as SequelizeOptions);

    await this.sequelize
      .authenticate()
      .then(() => {
        //this.syncModels();
        console.log("DB Connection has been established successfully.");
      })
      .catch((err: any) => {
        console.error("Unable to connect to the Database:", err);
      });
  }

  public async initDatabase() {
    //await initDB();
  }

  syncModels() {
    UserProfile.sync({ force: true });
    Collaterals.sync({ force: true });
    MasterLps.sync({ force: true });
    Prices.sync({ force: true });
    SynAssets.sync({ force: true });
    Contracts.sync({ force: true });
  }
}

export default Database;