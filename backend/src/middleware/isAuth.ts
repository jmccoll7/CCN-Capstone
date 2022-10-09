import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
  console.log("isAuth running...")
  if (!context.req.session.userId) {
    console.log("no session found")
    throw new Error("Not logged in")
  }
  return next();
}