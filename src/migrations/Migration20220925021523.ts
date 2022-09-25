import { Migration } from '@mikro-orm/migrations';

export class Migration20220925021523 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `post` modify `project` text not null, modify `contractor` text not null, modify `created_at` datetime not null, modify `updated_at` datetime not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `post` modify `project` varchar(255) not null, modify `contractor` varchar(255) not null, modify `created_at` json not null, modify `updated_at` json not null;');
  }

}
