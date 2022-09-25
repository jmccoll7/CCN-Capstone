import { EntityManager, Connection, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express'
import { Session, SessionData } from "express-session";

// Define context type for GraphQL Resolvers
export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { 
    session: Session & Partial<SessionData> & { 
      userId?: number
    } 
  };
  res: Response;
}