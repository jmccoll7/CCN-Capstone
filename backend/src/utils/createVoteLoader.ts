import DataLoader from "dataloader";
import { In } from "typeorm";
import { Votes } from "../entities/Votes";

export const createVoteLoader = () =>
  new DataLoader<{ postId: number; userId: number | undefined }, Votes | null>(
    async (keys) => {
      const votes = await Votes.find({
        where: {
          postId: In(keys.map((key) => key.postId)),
          userId: In(keys.map((key) => key.userId)),
        },
      });
      const voteIdsToVote: Record<string, Votes> = {};
      votes.forEach((vote) => {
        voteIdsToVote[`${vote.userId}|${vote.postId}`] = vote;
      });
      return keys.map((key) => voteIdsToVote[`${key.userId}|${key.postId}`]);
    }
  );
