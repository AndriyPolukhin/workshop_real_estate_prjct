import { Database, Booking, Listing } from '../../../lib/types'

export const bookingResolvers = {
	Booking: {
		id: (booking: Booking): string => {
			return booking._id.toString()
		},
		listing: async (
			booking: Booking,
			_args: {},
			{ db }: { db: Database }
		): Promise<Listing | null> => {
			return await db.listings.findOne({ _id: booking.listing })
		},
	},
}
