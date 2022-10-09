import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Unique, BaseEntity, ManyToOne } from "typeorm";
import { ArgsType, Field, Float, Int, ObjectType } from "type-graphql";
import { User } from "./User";

// Define item_prices table (entity)
@Entity()
@ObjectType()
@Unique(["item_code", "project", "contractor"])
export class ItemPrices extends BaseEntity {
  // Unique constraint for "item_code, project, contractor" columns
  // Columns:
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field(() => Int)
  @Column({ type: "int" })
  item_code!: number;

  @Field(() => String)
  @Column({ type: "varchar" })
  project!: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  contractor!: string;

  @Field(() => Float)
  @Column({ type: "float" })
  quantity!: number;

  @Field(() => Float)
  @Column({ type: "float" })
  unit_bid_price!: number;

  @Field()
  @Column()
  creatorId: number

  @ManyToOne(() => User, (user) => user.id)
  creator: User

  @Field(() => String)
  @CreateDateColumn()
  created_at?: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at?: Date;
}

// Class definition for item_prices table columns to be used as query arguments
@ArgsType()
export class ItemPricesArgs {
  @Field(() => Int)
  item_code!: number;

  @Field(() => String)
  project!: string;

  @Field(() => Float)
  quantity!: number;

  @Field(() => Float)
  unit_bid_price!: number;

  @Field(() => String)
  contractor!: string;
}
