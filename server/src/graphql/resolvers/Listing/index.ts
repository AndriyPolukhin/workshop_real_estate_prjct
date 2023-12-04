import { GraphQLError } from 'graphql'
import { Database, Listing } from '../../../lib/types'
import { ObjectId } from 'mongodb'

export const listingResolver = {
	Query: {
		listings: async (
			_root: undefined,
			_args: {},
			{ db }: { db: Database }
		): Promise<Listing[]> => {
			return await db.listings.find({}).toArray()
		},
	},
	Mutation: {
		deleteListing: async (
			_root: undefined,
			{ id }: { id: string },
			{ db }: { db: Database }
		): Promise<Listing> => {
			const deleteRes = await db.listings.findOneAndDelete({
				_id: new ObjectId(id),
			})

			if (!deleteRes) {
				throw new GraphQLError('Invalid listing id value', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				})
			}
			return deleteRes
		},
	},
	Listing: {
		id: (listing: Listing): string => listing._id.toString(),
	},
}
