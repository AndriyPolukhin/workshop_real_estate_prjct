import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Booking = {
  __typename?: 'Booking';
  checkIn: Scalars['String']['output'];
  checkOut: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  listing: Listing;
  tenant: User;
};

export type Bookings = {
  __typename?: 'Bookings';
  result: Array<Booking>;
  total: Scalars['Int']['output'];
};

export type ConnectStripeInput = {
  code: Scalars['String']['input'];
};

export type CreateBookingInput = {
  checkIn: Scalars['String']['input'];
  checkOut: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  source: Scalars['String']['input'];
};

export type HostListingInput = {
  address: Scalars['String']['input'];
  description: Scalars['String']['input'];
  image: Scalars['String']['input'];
  numOfGuests: Scalars['Int']['input'];
  price: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  type: ListingType;
};

export type Listing = {
  __typename?: 'Listing';
  address: Scalars['String']['output'];
  admin: Scalars['String']['output'];
  bookings?: Maybe<Bookings>;
  bookingsIndex: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  description: Scalars['String']['output'];
  host: User;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  numOfGuests: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  type: ListingType;
};


export type ListingBookingsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export enum ListingType {
  Appartment = 'APPARTMENT',
  House = 'HOUSE'
}

export type Listings = {
  __typename?: 'Listings';
  region?: Maybe<Scalars['String']['output']>;
  result: Array<Listing>;
  total: Scalars['Int']['output'];
};

export enum ListingsFilter {
  PriceHighToLow = 'PRICE_HIGH_TO_LOW',
  PriceLowToHigh = 'PRICE_LOW_TO_HIGH'
}

export type LogInInput = {
  code: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  connectStripe: Viewer;
  createBooking: Booking;
  disconnectStripe: Viewer;
  hostListing: Listing;
  logIn: Viewer;
  logOut: Viewer;
};


export type MutationConnectStripeArgs = {
  input: ConnectStripeInput;
};


export type MutationCreateBookingArgs = {
  input: CreateBookingInput;
};


export type MutationHostListingArgs = {
  input: HostListingInput;
};


export type MutationLogInArgs = {
  input?: InputMaybe<LogInInput>;
};

export type Query = {
  __typename?: 'Query';
  authUrl: Scalars['String']['output'];
  listing: Listing;
  listings: Listings;
  user: User;
};


export type QueryListingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListingsArgs = {
  filter?: InputMaybe<ListingsFilter>;
  limit: Scalars['Int']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  bookings?: Maybe<Bookings>;
  contact: Scalars['String']['output'];
  hasWallet: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  income?: Maybe<Scalars['Int']['output']>;
  listings: Listings;
  name: Scalars['String']['output'];
};


export type UserBookingsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type UserListingsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type Viewer = {
  __typename?: 'Viewer';
  avatar?: Maybe<Scalars['String']['output']>;
  didRequest: Scalars['Boolean']['output'];
  hasWallet?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Booking: ResolverTypeWrapper<Booking>;
  Bookings: ResolverTypeWrapper<Bookings>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ConnectStripeInput: ConnectStripeInput;
  CreateBookingInput: CreateBookingInput;
  HostListingInput: HostListingInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Listing: ResolverTypeWrapper<Listing>;
  ListingType: ListingType;
  Listings: ResolverTypeWrapper<Listings>;
  ListingsFilter: ListingsFilter;
  LogInInput: LogInInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  Viewer: ResolverTypeWrapper<Viewer>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Booking: Booking;
  Bookings: Bookings;
  Boolean: Scalars['Boolean']['output'];
  ConnectStripeInput: ConnectStripeInput;
  CreateBookingInput: CreateBookingInput;
  HostListingInput: HostListingInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Listing: Listing;
  Listings: Listings;
  LogInInput: LogInInput;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  User: User;
  Viewer: Viewer;
};

export type BookingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Booking'] = ResolversParentTypes['Booking']> = {
  checkIn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  checkOut?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType>;
  tenant?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bookings'] = ResolversParentTypes['Bookings']> = {
  result?: Resolver<Array<ResolversTypes['Booking']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Listing'] = ResolversParentTypes['Listing']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  admin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bookings?: Resolver<Maybe<ResolversTypes['Bookings']>, ParentType, ContextType, RequireFields<ListingBookingsArgs, 'limit' | 'page'>>;
  bookingsIndex?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  host?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numOfGuests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ListingType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Listings'] = ResolversParentTypes['Listings']> = {
  region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Array<ResolversTypes['Listing']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  connectStripe?: Resolver<ResolversTypes['Viewer'], ParentType, ContextType, RequireFields<MutationConnectStripeArgs, 'input'>>;
  createBooking?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationCreateBookingArgs, 'input'>>;
  disconnectStripe?: Resolver<ResolversTypes['Viewer'], ParentType, ContextType>;
  hostListing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<MutationHostListingArgs, 'input'>>;
  logIn?: Resolver<ResolversTypes['Viewer'], ParentType, ContextType, Partial<MutationLogInArgs>>;
  logOut?: Resolver<ResolversTypes['Viewer'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<QueryListingArgs, 'id'>>;
  listings?: Resolver<ResolversTypes['Listings'], ParentType, ContextType, RequireFields<QueryListingsArgs, 'limit' | 'page'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bookings?: Resolver<Maybe<ResolversTypes['Bookings']>, ParentType, ContextType, RequireFields<UserBookingsArgs, 'limit' | 'page'>>;
  contact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasWallet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  income?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  listings?: Resolver<ResolversTypes['Listings'], ParentType, ContextType, RequireFields<UserListingsArgs, 'limit' | 'page'>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ViewerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Viewer'] = ResolversParentTypes['Viewer']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  didRequest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasWallet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Booking?: BookingResolvers<ContextType>;
  Bookings?: BookingsResolvers<ContextType>;
  Listing?: ListingResolvers<ContextType>;
  Listings?: ListingsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Viewer?: ViewerResolvers<ContextType>;
};

