import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ItemPricesResolver } from "./resolvers/item_prices";
import { UserResolver } from "./resolvers/user";

const main = async () => {

  // Initialize MikroORM with the mikro-orm.config
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  // Initialize the Express App
  const app = express();

  // Request a specific context for MikroORM
  app.use((_req, _res, next) => {
    RequestContext.create(orm.em, next)
  })

  // Initialize Apollo server object for GraphQL API
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemPricesResolver, UserResolver],
      validate: false
    }),
    context: () => ({em: orm.em}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  });

  // Prepare Apollo server to handle incoming operations
  await apolloServer.start();

  // Connect Apollo server to Express framework
  apolloServer.applyMiddleware({app});

  // Listen for HTTP connections to the application on port 4121
  app.listen(process.env.PORT, () => {
    console.log('Server running. API available at http://localhost:' + process.env.PORT + '/graphql');
  })
}

// Catch any errors in the main function and log to the console
main().catch(err => {
  console.error(err)
});
