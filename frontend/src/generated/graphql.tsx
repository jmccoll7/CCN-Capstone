import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type ItemPrices = {
  __typename?: "ItemPrices";
  contractor: Scalars["String"];
  created_at: Scalars["String"];
  item_code: Scalars["Int"];
  project: Scalars["String"];
  quantity: Scalars["Float"];
  unit_bid_price: Scalars["Float"];
  updated_at: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  login: UserResponse;
  post_item_price: ItemPrices;
  register: UserResponse;
};

export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};

export type MutationPost_Item_PriceArgs = {
  contractor: Scalars["String"];
  item_code: Scalars["Int"];
  project: Scalars["String"];
  quantity: Scalars["Float"];
  unit_bid_price: Scalars["Float"];
};

export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};

export type Query = {
  __typename?: "Query";
  get_item_prices: Array<ItemPrices>;
  get_prices_by_item: Array<ItemPrices>;
  me?: Maybe<User>;
};

export type QueryGet_Prices_By_ItemArgs = {
  item_code: Scalars["Float"];
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"];
  id: Scalars["Int"];
  updatedAt: Scalars["DateTime"];
  username: Scalars["String"];
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  password: Scalars["String"];
  username: Scalars["String"];
};

export type RegisterMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "UserResponse";
    user?: { __typename?: "User"; id: number; username: string } | null;
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
  };
};

export const RegisterDocument = gql`
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      user {
        id
        username
      }
      errors {
        field
        message
      }
    }
  }
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );
}
