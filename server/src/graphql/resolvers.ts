import { GraphQLError } from 'graphql'
import { listings } from '../listings.js'

export const resolvers = {
	Query: {
		listings: () => {
			return listings
		},
	},
	Mutation: {
		deleteListing: (_root: undefined, { id }: { id: string }) => {
			for (let i = 0; i < listings.length; i++) {
				if (listings[i].id === id) {
					return listings.splice(i, 1)[0]
				}
			}
			throw new GraphQLError('Invalid listing id value', {
				extensions: {
					code: 'BAD_USER_INPUT',
				},
			})
		},
	},
}
