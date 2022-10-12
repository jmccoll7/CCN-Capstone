import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { AppDataSource } from "../typeorm-config";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Date, { nullable: true }) cursor: Date | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    // const posts = await AppDataSource.query(
    //   `select post.*, json_build_object(
    //     'id', user.id,
    //     'username', user.username,
    //     'email', user.email,
    //     'createdAt', user.createdAt
    //     ) creator from post join user on user.id = post.creatorId ${
    //       cursor ? `where post.createdAt < ?` : ""
    //     } order by post.createdAt DESC limit ?`,
    //   [cursor, realLimitPlusOne]
    // );

    const qb = AppDataSource.getRepository(Post)
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.creator", "user", "user.id = post.creatorId")
      .orderBy("post.createdAt", "DESC")
      .take(realLimitPlusOne);
    if (cursor) {
      qb.where("post.createdAt < :cursor", { cursor });
    }

    const posts = await qb.getMany();

    // Query to pull vote status for the loaded posts
    const voteStatuses = (await AppDataSource.query(
      `select post.id, post.createdAt, ${
        req.session.userId ? `votes.value` : `null`
      } as voteStatus from votes right join post on post.id = votes.postId AND post.creatorId = votes.userId
      ${
        cursor && req.session.userId
          ? `where post.createdAt < ? AND (votes.userId = ${req.session.userId} OR votes.userId is null)`
          : cursor
          ? `where post.createdAt <= ?`
          : req.session.userId
          ? `where votes.userId = ${req.session.userId} OR votes.userId is null`
          : ""
      }
      order by post.createdAt DESC
      limit ${realLimitPlusOne}`,
      [cursor, cursor]
    )) /* Inline type definition to match query results */ as [
      RowDataPacket: {
        id: number;
        createdAt: Date;
        voteStatus: number | null;
      }
    ];

    // Add voteStatus attribute to posts
    posts.forEach((post, i) => {
      // console.log(i, "equal?", post.id, voteStatuses[i].id, post.id === voteStatuses[i].id )
      if (post.id === voteStatuses[i].id) {
        post.voteStatus = voteStatuses[i].voteStatus;
      } else {
        throw new Error(
          "Post ID doesn't match with the queried vote statuses (posts resolver)"
        );
      }
    });
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOne({
      where: {
        id: id,
      },
      relations: ["creator"],
    });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    await AppDataSource.createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where("id = :id and creatorId = :creatorId", {
        id,
        creatorId: req.session.userId,
      })
      .execute();
      return Post.findOneBy({id});
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log("Authenticated user for deletion: ", req.session.userId);
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
