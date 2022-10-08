import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { APP_LISTENER_PORT, COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ItemPricesResolver } from "./resolvers/item_prices";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import cors from "cors";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { ItemPrices } from "./entities/ItemPrices";

const main = async () => {
  const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "txdotbidsdb",
    synchronize: true,
    logging: true,
    entities: [ItemPrices, User],
  });

  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization: ", err);
    });

  // Initialize the Express App
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365.25 * 10,
        httpOnly: true,
        secure: __prod__, // __prod__, // cookie only works in https
        sameSite: "lax", // csrf
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );

  // Initialize Apollo server object for GraphQL API
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemPricesResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  // Prepare Apollo server to handle incoming operations
  await apolloServer.start();

  // Connect Apollo server to Express framework
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Listen for HTTP connections to the application on port 4121
  app.listen(APP_LISTENER_PORT, () => {
    console.log(
      "Server running. API available at http://localhost:" +
        APP_LISTENER_PORT +
        "/graphql"
    );
  });
};

// Catch any errors in the main function and log to the console
main().catch((err) => {
  console.error(err);
});
