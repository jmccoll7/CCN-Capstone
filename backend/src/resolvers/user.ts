import argon2 from "argon2";
import { MyContext } from "../types";
import { validateRegister } from "../utils/validateRegister";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { User } from "../entities/User";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

// Define error object
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

// Define user response object
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

// Define queries and updates for user table
@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their email
    if (req.session.userId == user.id) {
      return user.email;
    }
    // current user wants to see someone else's email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "invalid or expired token",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOneBy({ id: userIdNum });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    // delete key
    await redis.del(key);

    // Log in after PW change
    req.session.userId = user.id;

    return { user };
  }

  // Send password reset email
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOneBy({ email });
    if (!user) {
      // Email doesn't exist
      return true;
    }

    // Create UUID token
    const token = v4();

    redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "EX", 600);

    await sendEmail(
      email,
      `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`
    );
    return true;
  }

  // Check current user identity
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    console.log("Session details from 'Me' Query: ", req.session);
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    console.log("id found: ", req.session.userId);
    return User.findOneBy({ id: req.session.userId });
  }

  // Register user
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    // Check for an existing user
    const findUser = await User.findOneBy({ username: options.username });
    const userExists = findUser !== null;

    // Validate here
    const errors = validateRegister(options, userExists);
    if (errors) {
      return { errors };
    }

    // Use argon2 to hash password for storage
    const hashedPassword = await argon2.hash(options.password);

    const user = await User.create({
      username: options.username,
      email: options.email,
      password: hashedPassword,
    }).save();
    // Stores the user session after registering
    // Sets cookie to keep user logged in
    req.session.userId = user.id;

    return { user };
  }

  // User login
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOneBy(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid login",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid login",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
