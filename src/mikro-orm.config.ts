import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { ItemPrices } from "./entities/ItemPrices";
import path from 'path';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}'
  },
  allowGlobalContext: true,
  entities: [ItemPrices],
  dbName: 'txdotbidsdb',
  user: 'app-user',
  password: 'app-user-password-123',
  type: 'mysql',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];