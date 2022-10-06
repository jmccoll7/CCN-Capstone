import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { APP_LISTENER_PORT, __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ItemPricesResolver } from "./resolvers/item_prices";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import connectRedis from "connect-redis";
import session from "express-session";
import redis from "redis";
import cors from "cors";

const main = async () => {
  // Initialize MikroORM with the mikro-orm.config
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  // Initialize the Express App
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
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

  // Request a specific context for MikroORM
  app.use((_req, _res, next) => {
    RequestContext.create(orm.em, next);
  });

  // Initialize Apollo server object for GraphQL API
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemPricesResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
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
