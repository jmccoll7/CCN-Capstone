import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { ItemPrices } from "./entities/ItemPrices";
import path from 'path';
import { User } from "./entities/User";

// Export database connection details for MikroORM
export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}'
  },
  entities: [ItemPrices, User],
  dbName: 'txdotbidsdb',
  user: 'app-user',
  password: 'app-user-password-123',
  type: 'mysql',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];