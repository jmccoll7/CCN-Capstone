import { __prod__ } from "../constants";
import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1665631328924 implements MigrationInterface {
  name = "migrations1665631328924";

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (__prod__) {
      await queryRunner.query(
        `CREATE TABLE \`votes\` (\`value\` int NOT NULL, \`userId\` int NOT NULL, \`postId\` int NOT NULL, PRIMARY KEY (\`userId\`, \`postId\`)) ENGINE=InnoDB`
      );
      await queryRunner.query(
        `CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`creatorId\` int NOT NULL, \`title\` text NOT NULL, \`text\` text NOT NULL, \`points\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
      );
      await queryRunner.query(
        `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
      );
      await queryRunner.query(
        `CREATE TABLE \`item_prices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`item_code\` int NOT NULL, \`project\` varchar(255) NOT NULL, \`contractor\` varchar(255) NOT NULL, \`quantity\` float NOT NULL, \`unit_bid_price\` float NOT NULL, \`creatorId\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4233163601c023f69694ee0dd5\` (\`item_code\`, \`project\`, \`contractor\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
      );
      await queryRunner.query(
        `ALTER TABLE \`votes\` ADD CONSTRAINT \`FK_5169384e31d0989699a318f3ca4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
      );
      await queryRunner.query(
        `ALTER TABLE \`votes\` ADD CONSTRAINT \`FK_b5b05adc89dda0614276a13a599\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
      );
      await queryRunner.query(
        `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_9e91e6a24261b66f53971d3f96b\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
      );
      await queryRunner.query(
        `ALTER TABLE \`item_prices\` ADD CONSTRAINT \`FK_2ec894263d1dd564fb0a03e78ee\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (__prod__) {
      await queryRunner.query(
        `ALTER TABLE \`item_prices\` DROP FOREIGN KEY \`FK_2ec894263d1dd564fb0a03e78ee\``
      );
      await queryRunner.query(
        `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_9e91e6a24261b66f53971d3f96b\``
      );
      await queryRunner.query(
        `ALTER TABLE \`votes\` DROP FOREIGN KEY \`FK_b5b05adc89dda0614276a13a599\``
      );
      await queryRunner.query(
        `ALTER TABLE \`votes\` DROP FOREIGN KEY \`FK_5169384e31d0989699a318f3ca4\``
      );
      await queryRunner.query(
        `DROP INDEX \`IDX_4233163601c023f69694ee0dd5\` ON \`item_prices\``
      );
      await queryRunner.query(`DROP TABLE \`item_prices\``);
      await queryRunner.query(
        `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``
      );
      await queryRunner.query(
        `DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``
      );
      await queryRunner.query(`DROP TABLE \`user\``);
      await queryRunner.query(`DROP TABLE \`post\``);
      await queryRunner.query(`DROP TABLE \`votes\``);
    }
  }
}
