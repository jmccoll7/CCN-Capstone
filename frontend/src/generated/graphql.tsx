import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ItemPrices = {
  __typename?: 'ItemPrices';
  contractor: Scalars['String'];
  created_at: Scalars['String'];
  item_code: Scalars['Int'];
  project: Scalars['String'];
  quantity: Scalars['Float'];
  unit_bid_price: Scalars['Float'];
  updated_at: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: UserResponse;
  logout: Scalars['Boolean'];
  post_item_price: ItemPrices;
  register: UserResponse;
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};


export type MutationPost_Item_PriceArgs = {
  contractor: Scalars['String'];
  item_code: Scalars['Int'];
  project: Scalars['String'];
  quantity: Scalars['Float'];
  unit_bid_price: Scalars['Float'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};

export type Query = {
  __typename?: 'Query';
  get_item_prices: Array<ItemPrices>;
  get_prices_by_item: Array<ItemPrices>;
  me?: Maybe<User>;
};


export type QueryGet_Prices_By_ItemArgs = {
  item_code: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegularUserFragment = { __typename?: 'User', id: number, username: string };

export type LoginMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetItemPricesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetItemPricesQuery = { __typename?: 'Query', get_item_prices: Array<{ __typename?: 'ItemPrices', item_code: number, project: string, unit_bid_price: number, quantity: number, contractor: string, created_at: string, updated_at: string }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const LoginDocument = gql`
    mutation Login($options: UsernamePasswordInput!) {
  login(options: $options) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const GetItemPricesDocument = gql`
    query getItemPrices {
  get_item_prices {
    item_code
    project
    unit_bid_price
    quantity
    contractor
    created_at
    updated_at
  }
}
    `;

export function useGetItemPricesQuery(options?: Omit<Urql.UseQueryArgs<GetItemPricesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetItemPricesQuery, GetItemPricesQueryVariables>({ query: GetItemPricesDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};