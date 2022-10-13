import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { createVoteLoader } from "./utils/createVoteLoader";
import { createUserLoader } from "./utils/createUserLoader";

// Define context type for GraphQL Resolvers
export type MyContext = {
  req: Request & {
    session: Session &
      Partial<SessionData> & {
        userId?: number | undefined;
      };
  };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  voteLoader: ReturnType<typeof createVoteLoader>;
};
