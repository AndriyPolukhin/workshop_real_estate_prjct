import merge from 'lodash.merge'
import { viewerResolvers } from './Viewer/index.js'
import { userResolvers } from './User/index.js'
import { listingResolvers } from './Listing/index.js'
import { bookingResolvers } from './Booking/index.js'

export const resolvers = merge(
	bookingResolvers,
	listingResolvers,
	userResolvers,
	viewerResolvers
)
