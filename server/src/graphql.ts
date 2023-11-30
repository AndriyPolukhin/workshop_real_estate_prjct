import {
	GraphQLError,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql'

import { listings } from './listings.js'

const Listing = new GraphQLObjectType({
	name: 'Listing',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		title: { type: new GraphQLNonNull(GraphQLString) },
		image: { type: new GraphQLNonNull(GraphQLString) },
		address: { type: new GraphQLNonNull(GraphQLString) },
		price: { type: new GraphQLNonNull(GraphQLInt) },
		numOfGuests: { type: new GraphQLNonNull(GraphQLInt) },
		numOfBeds: { type: new GraphQLNonNull(GraphQLInt) },
		numOfBaths: { type: new GraphQLNonNull(GraphQLInt) },
		rating: { type: new GraphQLNonNull(GraphQLInt) },
	},
})

const query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		listings: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Listing))),
			resolve: () => {
				return listings
			},
		},
	},
})

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		deleteListing: {
			type: new GraphQLNonNull(Listing),
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (_root, { id }) => {
				const listingsUpdated = listings.map((listing, i) => {
					if (listing.id === id) {
						return listings.splice(i, 1)[0]
					}
				})
				if (listings.length === listingsUpdated.length) {
					throw new GraphQLError('Invalid listing id value', {
						extensions: {
							code: 'BAD_USER_INPUT',
						},
					})
				} else {
					return listings
				}
			},
		},
	},
})

export const schema = new GraphQLSchema({ query, mutation })
