import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
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
import { PostResolver } from "./resolvers/post";
import { AppDataSource } from "./typeorm-config";
import { VotesResolver } from "./resolvers/votes";
import { createUserLoader } from "./utils/createUserLoader";
import { createVoteLoader } from "./utils/createVoteLoader";

const main = async () => {

  // Initialize the Express App
  const app = express();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization: ", err);
    });

  await AppDataSource.runMigrations();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

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
        secure: __prod__, // cookie only works in https
        sameSite: "lax", // csrf
        domain: __prod__ ? ".txdot-bidanalysis.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  // Initialize Apollo server object for GraphQL API
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ItemPricesResolver,
        UserResolver,
        PostResolver,
        VotesResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      voteLoader: createVoteLoader(),
    }),
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
  app.listen(parseInt(process.env.PORT as string), () => {
    console.log("Server running. API available.");
  });
};

// Catch any errors in the main function and log to the console
main().catch((err) => {
  console.error(err);
});
