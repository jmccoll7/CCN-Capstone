import {
  Field,
  InputType
} from "type-graphql";

// Define input type for user table queries

@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}
