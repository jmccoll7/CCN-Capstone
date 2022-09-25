"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const ItemPrices_1 = require("./entities/ItemPrices");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}'
    },
    allowGlobalContext: true,
    entities: [ItemPrices_1.ItemPrices],
    dbName: 'txdotbidsdb',
    user: 'app-user',
    password: 'app-user-password-123',
    type: 'mysql',
    debug: !constants_1.__prod__
};
//# sourceMappingURL=mikro-orm.config.js.map