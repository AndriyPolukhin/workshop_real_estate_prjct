import dotenv from 'dotenv'
dotenv.config()
import { Listing, User, Booking, Database } from '../src/lib/types'

import { MongoClient } from 'mongodb'

const connectDatabase = async (): Promise<Database> => {
	try {
		const client = await MongoClient.connect(`${process.env.MONGO_URI}`)

		const db = client.db('main')
		console.log(`
    💽  MongoDB Connected to db: ${db.namespace}`)

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

const clear = async () => {
	try {
		console.log(`
    🎰 [clear] : running...`)

		const db = await connectDatabase()

		const bookings = await db.bookings.find({}).toArray()
		const listings = await db.listings.find({}).toArray()
		const users = await db.users.find({}).toArray()

		if (bookings.length > 0) {
			await db.bookings.drop()
		}

		if (listings.length > 0) {
			await db.listings.drop()
		}

		if (users.length > 0) {
			await db.users.drop()
		}

		console.log(`
    🏟️ [clear] : successfull`)
		process.exit()
	} catch (error) {
		throw new Error('failed to clear database')
	}
}

clear()
