import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (
  options: UsernamePasswordInput,
  userExists: boolean
) => {
  if (userExists) {
    return [
      {
        field: "username",
        message: "username already exists",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Invalid character: '@'",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }
  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "length must be greater than 3",
      },
    ];
  }

  return null;
};
