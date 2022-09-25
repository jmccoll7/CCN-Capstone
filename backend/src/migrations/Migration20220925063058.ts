import { Migration } from '@mikro-orm/migrations';

export class Migration20220925063058 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `item_prices` (`item_code` int unsigned not null, `project` varchar(255) not null, `contractor` varchar(255) not null, `quantity` float not null, `unit_bid_price` float not null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`item_code`, `project`, `contractor`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `item_prices`;');
  }

}
