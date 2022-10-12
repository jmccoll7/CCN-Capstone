import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Votes } from "../entities/Votes";
import { AppDataSource } from "../typeorm-config";

@Resolver(Votes)
export class VotesResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUp = value !== -1;
    const realValue = isUp ? 1 : -1;
    const { userId } = req.session;

    const upVote = await Votes.findOne({
      where: {
        postId,
        userId,
      },
    });

    if (upVote && upVote.value !== realValue) {
      // User has voted but is changing the vote
      await AppDataSource.transaction(async (tm) => {
        await tm.query(
          `update votes set value = ? where postId = ? and userId = ?`,
          [realValue, postId, userId]
        );
        await tm.query(`update post set points = points + ? where id = ?`, [
          2 * realValue,
          postId,
        ]);
      });
    } else if (!upVote) {
      // User hasn't voted
      await AppDataSource.transaction(async (tm) => {
        await tm.query(
          `insert into votes (userId, postId, value) values (?,?,?)`,
          [userId, postId, realValue]
        );
        await tm.query(`update post set points = points + ? where id = ?`, [
          realValue,
          postId,
        ]);
      });
    }

    // Votes.insert({
    //   userId,
    //   postId,
    //   value,
    // });
    // Update the current points value on the post

    // await AppDataSource.query(`START TRANSACTION`);
    // await AppDataSource.query(
    //   `insert into votes (userId, postId, value) values (?,?,?)`,
    //   [userId, postId, realValue]
    // );
    // await AppDataSource.query(
    //   `update post set points = points + ? where id = ?`,
    //   [realValue, postId]
    // );
    // await AppDataSource.query(`COMMIT`);

    return true;
  }
}
