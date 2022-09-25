import "reflect-metadata"
import { MikroORM, RequestContext } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"
import { ItemPricesResolver } from "./resolvers/item_prices";
import { UserResolver } from "./resolvers/user";

const main = async () => {

  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.getMigrator().up();

  const app = express();

  app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
  })

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemPricesResolver, UserResolver],
      validate: false
    }),
    context: () => ({em: orm.em}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({app});

  app.get('/', (_, res) => {
    res.send('Hello!');
  })

  app.listen(4121, () => {
    console.log('Server running at http://localhost:4121');
  })
}

main().catch(err => {
  console.error(err)
});
