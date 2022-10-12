import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Votes extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value: number;

  @Field(() => User)
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE'})
  user: User;

  @Field(() => Post)
  @PrimaryColumn()
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.votes, { onDelete: 'CASCADE'})
  post: Post;
}
