import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import config from "../config/db.config.json";

// models
import UserProfile from "../models/user-profile.model";
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
      ]
    } as SequelizeOptions);

    await this.sequelize
      .authenticate()
      .then(() => {
        UserProfile.sync({ force: false });
        console.log("DB Connection has been established successfully.");
      })
      .catch((err: any) => {
        console.error("Unable to connect to the Database:", err);
      });
  }

  public async initDatabase() {
    await initDB();
  }
}

export default Database;