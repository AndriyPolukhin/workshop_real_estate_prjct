import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Google } from '../../../lib/api'
import { Listing, Database, User } from '../../../lib/types'
import { authorize } from '../../../lib/utils'
import {
	ListingArgs,
	ListingBookingsArgs,
	ListingBookingsData,
	ListingsFilter,
	ListingsArgs,
	ListingsData,
	ListingsQuery,
} from './types'

export const listingResolvers = {
	Query: {
		listing: async (
			_root: undefined,
			{ id }: ListingArgs,
			{ db, req }: { db: Database; req: Request }
		): Promise<Listing> => {
			try {
				const listing = await db.listings.findOne({ _id: new ObjectId(id) })

				if (!listing) {
					throw new Error("listing can't be found")
				}

				const viewer = await authorize(db, req)
				if (viewer && viewer._id === listing.host) {
					listing.authorized = true
				}

				return listing
			} catch (error) {
				throw new Error(`Failed to query listing: $ {error}`)
			}
		},
		listings: async (
			_root: undefined,
			{ location, filter, limit, page }: ListingsArgs,
			{ db }: { db: Database }
		): Promise<ListingsData> => {
			try {
				const query: ListingsQuery = {}
				const data: ListingsData = {
					region: null,
					total: 0,
					result: [],
				}

				if (location) {
					const { country, admin, city } = await Google.geocode(location)
					if (city) query.city = city
					if (admin) query.admin = admin
					if (country) {
						query.country = country
					} else {
						throw new Error('no country found')
					}

					const cityText = city ? `${city}, ` : ''
					const adminText = admin ? `${admin}, ` : ''
					data.region = `${cityText}${adminText}${country}`
				}

				let cursor = await db.listings.find(query)
				const total = (await db.listings.find({}).toArray()).length

				if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
					cursor = cursor.sort({
						price: 1,
					})
				}

				if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
					cursor = cursor.sort({
						price: -1,
					})
				}

				cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0)
				cursor = cursor.limit(limit)

				data.total = total
				data.result = await cursor.toArray()

				return data
			} catch (error) {
				throw new Error(`Failed to query listings: ${error}`)
			}
		},
	},
	Listing: {
		id: (listing: Listing): string => {
			return listing._id.toString()
		},
		host: async (
			listing: Listing,
			_args: {},
			{ db }: { db: Database }
		): Promise<User> => {
			try {
				const host = await db.users.findOne({ _id: listing.host })
				if (!host) {
					throw new Error("host couldn't be found")
				}
				return host
			} catch (error) {
				throw new Error(`failed to query host: ${error}`)
			}
		},
		bookingsIndex: (listing: Listing): string => {
			return JSON.stringify(listing.bookingsIndex)
		},
		bookings: async (
			listing: Listing,
			{ limit, page }: ListingBookingsArgs,
			{ db }: { db: Database }
		): Promise<ListingBookingsData | null> => {
			try {
				if (!listing.authorized) {
					return null
				}

				const data: ListingBookingsData = {
					total: 0,
					result: [],
				}
				let cursor = await db.bookings.find({
					_id: { $in: listing.bookings },
				})

				cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0)
				cursor = cursor.limit(limit)

				data.total = (
					await db.bookings
						.find({
							_id: { $in: listing.bookings },
						})
						.toArray()
				).length
				data.result = await cursor.toArray()

				return data
			} catch (error) {
				throw new Error(`Failed to  query user listing bookings: ${error}`)
			}
		},
	},
}
