import { DataSource } from "typeorm";
import { ItemPrices } from "./entities/ItemPrices";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Votes } from "./entities/Votes";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "txdotbidsdb",
  synchronize: true,
  logging: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [ItemPrices, User, Post, Votes],
});
