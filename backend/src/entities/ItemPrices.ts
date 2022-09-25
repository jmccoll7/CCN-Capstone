import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ArgsType, Field, Float, Int, ObjectType } from "type-graphql";

// Define item_prices table (entity)
@Entity()
@ObjectType()
export class ItemPrices {

  // Primary Key is a composite key made up of "item_code, project, contractor" columns
  // Columns:
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