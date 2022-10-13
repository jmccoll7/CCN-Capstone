import { DataSource } from "typeorm";
import { ItemPrices } from "./entities/ItemPrices";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Votes } from "./entities/Votes";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  synchronize: true,
  username: "express-app-user",
  password: "DHGIUJHuyguyf89yui3t93whygreret",
  host: "localhost",
  database: "txdotbidsdb2",
  port: 3306,
  logging: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, ItemPrices, User, Votes],
});
