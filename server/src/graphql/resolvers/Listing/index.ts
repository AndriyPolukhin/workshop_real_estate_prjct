import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Google, Cloudinary } from '../../../lib/api'
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
	HostListingInput,
	HostListingArgs,
} from './types'
import { ListingType } from '../../types'

const verifyHostListingInput = ({
	title,
	description,
	type,
	price,
}: HostListingInput) => {
	if (title.length > 100) {
		throw new Error('listing title must be under 100 characters')
	}
	if (description.length > 5000) {
		throw new Error('listing description must be under 5000 characters')
	}
	if (type !== ListingType.Appartment && type !== ListingType.House) {
		throw new Error('listing type must be either an appartment or house')
	}

	if (price < 0) {
		throw new Error('listing price must be greater than 0')
	}
}

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
				throw new Error(`Failed to query listing: ${error}`)
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

				data.total = (await db.listings.find(query).toArray()).length
				data.result = await cursor.toArray()

				return data
			} catch (error) {
				throw new Error(`Failed to query listings: ${error}`)
			}
		},
	},
	Mutation: {
		hostListing: async (
			_root: undefined,
			{ input }: HostListingArgs,
			{ db, req }: { db: Database; req: Request }
		): Promise<Listing> => {
			verifyHostListingInput(input)

			let viewer = await authorize(db, req)
			if (!viewer) {
				throw new Error('viewer cannot be found')
			}

			const { country, admin, city } = await Google.geocode(input.address)

			if (!country || !admin || !city) {
				throw new Error('invalid address input')
			}

			const imageUrl = await Cloudinary.upload(input.image)

			const insertResult = await db.listings.insertOne({
				_id: new ObjectId(),
				...input,
				image: imageUrl,
				bookings: [],
				bookingsIndex: {},
				country,
				admin,
				city,
				host: viewer._id,
			})

			const insertedListing = await db.listings.findOne({
				_id: insertResult.insertedId,
			})
			await db.users.updateOne(
				{ _id: viewer._id },
				{ $push: { listings: insertResult.insertedId } }
			)

			return insertedListing as Listing
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
