import { Migration } from '@mikro-orm/migrations';

export class Migration20220925024733 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `item_prices` (`item_code` int unsigned not null auto_increment primary key, `project` text not null, `quantity` numeric(10,0) not null, `unit_bid_price` numeric(10,0) not null, `contractor` text not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `post`;');
  }

  async down(): Promise<void> {
    this.addSql('create table `post` (`item_code` int unsigned not null auto_increment primary key, `project` text not null, `quantity` numeric(10,0) not null, `unit_bid_price` numeric(10,0) not null, `contractor` text not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `item_prices`;');
  }

}
