import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

// Define user table (entity)
@ObjectType()
@Entity()
export class User {

  // Columns:
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field()
  @Property({ unique: true })
  username!: string;

  @Field()
  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

}