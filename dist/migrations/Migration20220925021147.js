"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220925021147 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220925021147 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('create table `post` (`item_code` int unsigned not null auto_increment primary key, `project` varchar(255) not null, `quantity` int not null, `unit_bid_price` int not null, `contractor` varchar(255) not null, `created_at` json not null, `updated_at` json not null) default character set utf8mb4 engine = InnoDB;');
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('drop table if exists `post`;');
        });
    }
}
exports.Migration20220925021147 = Migration20220925021147;
//# sourceMappingURL=Migration20220925021147.js.map