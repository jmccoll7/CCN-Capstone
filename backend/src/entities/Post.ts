import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Votes } from "./Votes";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1, -1, null

  @Field()
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE'})
  creator: User;

  @OneToMany(() => Votes, (votes) => votes.post)
  votes: Votes[];

  @Field()
  @Column({ type: "text" })
  title!: string;

  @Field()
  @Column({ type: "text" })
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt?: Date = new Date();

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt?: Date = new Date();
}
