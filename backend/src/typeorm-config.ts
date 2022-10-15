import { DataSource } from "typeorm";
import { ItemPrices } from "./entities/ItemPrices";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Votes } from "./entities/Votes";
import path from "path";
import { __prod__ } from "./constants";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: process.env.DATABASE_URL,
  synchronize: !__prod__,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // port: 3306,
  logging: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, ItemPrices, User, Votes],
});
