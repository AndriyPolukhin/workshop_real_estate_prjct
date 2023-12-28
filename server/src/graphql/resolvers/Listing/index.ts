import { Listing } from '../../../lib/types'

export const listingResolvers = {
	Listing: {
		id: (listing: Listing): string => {
			return listing._id.toString()
		},
	},
}
