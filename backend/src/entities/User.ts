import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ItemPrices } from "./ItemPrices";
import { Post } from "./Post";

// Define user table (entity)
@ObjectType()
@Entity()
export class User extends BaseEntity {
  // Columns:
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => ItemPrices, (item_prices) => item_prices.creator)
  item_prices: ItemPrices[]

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[]

  @Field(() => Date)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt?: Date;
}
