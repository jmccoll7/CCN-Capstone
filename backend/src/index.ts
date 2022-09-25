import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import { ItemPrices } from "./entities/ItemPrices";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';

const main = async () => {

  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.getMigrator().up();

  const app = express();

  app.get('/', (_, res) => {
    res.send('Hello!');
  })

  app.listen(4121, () => {
    console.log('Server running at http://localhost:4121');
  })

  // const itemprices = orm.em.create(ItemPrices, {
  //   itemCode: 3166008,
  //   project: "NH 2017(260)",
  //   quantity: 807600.0,
  //   unitBidPrice: 2.1,
  //   contractor: "LIPHAM ASPHALT AND PAVING COMPANY, LLC"
  // });

  // await orm.em.persistAndFlush(itemprices);

  // const posts = await orm.em.find(ItemPrices, {} )
  // console.log(posts)

}

main().catch(err => {
  console.error(err)
});
