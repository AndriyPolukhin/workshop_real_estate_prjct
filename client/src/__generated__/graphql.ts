/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Listing = {
  __typename?: 'Listing';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  numOfBaths: Scalars['Int']['output'];
  numOfBeds: Scalars['Int']['output'];
  numOfGuests: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteListing: Listing;
};


export type MutationDeleteListingArgs = {
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  listings: Array<Listing>;
};

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { __typename?: 'Query', listings: Array<{ __typename?: 'Listing', id: string, title: string, image: string, address: string, price: number, numOfGuests: number, numOfBeds: number, numOfBaths: number, rating: number }> };

export type DeleteListingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteListingMutation = { __typename?: 'Mutation', deleteListing: { __typename?: 'Listing', id: string } };


export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"numOfGuests"}},{"kind":"Field","name":{"kind":"Name","value":"numOfBeds"}},{"kind":"Field","name":{"kind":"Name","value":"numOfBaths"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const DeleteListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteListingMutation, DeleteListingMutationVariables>;