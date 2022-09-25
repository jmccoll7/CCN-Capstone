import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ArgsType, Field, Float, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class ItemPrices {

  // @Field(() => Int)
  // @PrimaryKey()
  // id!: number;

  @Field(() => Int)
  @PrimaryKey({ type: "int" })
  item_code!: number;

  @Field(() => String)
  @PrimaryKey({ type: "varchar" })
  project!: string;

  @Field(() => Float)
  @Property({ type: "float" })
  quantity!: number;

  @Field(() => Float)
  @Property({ type: "float" })
  unit_bid_price!: number;

  @Field(() => String)
  @PrimaryKey({ type: "varchar" })
  contractor!: string;

  @Field(() => String)
  @Property({ type: "date" })
  created_at? = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updated_at? = new Date();
}

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