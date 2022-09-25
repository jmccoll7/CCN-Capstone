import { Migration } from '@mikro-orm/migrations';

export class Migration20220925021648 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `post` modify `quantity` numeric(10,0) not null, modify `unit_bid_price` numeric(10,0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `post` modify `quantity` int not null, modify `unit_bid_price` int not null;');
  }

}
