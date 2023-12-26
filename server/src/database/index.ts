import { MongoClient } from 'mongodb'
import { Database, User, Listing, Booking } from '../lib/types'

const connectDatabase = async (): Promise<Database> => {
	try {
		const client = await MongoClient.connect(`${process.env.MONGO_URI}`)

		const db = client.db('main')
		console.log(`		💽  MongoDB Connected to db: ${db.namespace}`)

		return {
			bookings: db.collection<Booking>('bookings'),
			listings: db.collection<Listing>('listings'),
			users: db.collection<User>('users'),
		}
	} catch (error) {
		console.log(`Error: ${error}`)
		process.exit(1)
	}
}

export default connectDatabase
