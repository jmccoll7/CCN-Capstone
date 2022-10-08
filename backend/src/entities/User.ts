import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Define user table (entity)
@ObjectType()
@Entity()
export class User extends BaseEntity {
  // Columns:
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt?: Date;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
