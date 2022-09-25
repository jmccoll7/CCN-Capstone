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
exports.Migration20220925021523 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220925021523 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table `post` modify `project` text not null, modify `contractor` text not null, modify `created_at` datetime not null, modify `updated_at` datetime not null;');
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table `post` modify `project` varchar(255) not null, modify `contractor` varchar(255) not null, modify `created_at` json not null, modify `updated_at` json not null;');
        });
    }
}
exports.Migration20220925021523 = Migration20220925021523;
//# sourceMappingURL=Migration20220925021523.js.map