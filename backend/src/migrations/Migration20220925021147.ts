import { Migration } from '@mikro-orm/migrations';

export class Migration20220925021147 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `post` (`item_code` int unsigned not null auto_increment primary key, `project` varchar(255) not null, `quantity` int not null, `unit_bid_price` int not null, `contractor` varchar(255) not null, `created_at` json not null, `updated_at` json not null) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `post`;');
  }

}
