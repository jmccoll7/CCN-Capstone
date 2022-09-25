import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import { ItemPrices } from "./entities/ItemPrices";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {

  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.getMigrator().up();
  console.log("here");

  const itemprices = orm.em.create(ItemPrices, {
    itemCode: 3166008,
    project: "NH 2017(260)",
    quantity: 807600.0,
    unitBidPrice: 2.1,
    contractor: "LIPHAM ASPHALT AND PAVING COMPANY, LLC"
  });

  await orm.em.persistAndFlush(itemprices);

}

main().catch(err => {
  console.error(err)
});
