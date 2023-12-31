import dotenv from 'dotenv'
dotenv.config()
import { Listing, User, Booking, Database } from '../src/lib/types'
import { listings } from './listings'
import { users } from './users'
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

const seed = async () => {
	try {
		console.log(`
    🎰 [seed] : running...`)

		const db = await connectDatabase()

		for (const listing of listings) {
			await db.listings.insertOne(listing)
		}
		for (const user of users) {
			await db.users.insertOne(user)
		}

		console.log(`
    🏟️ [seed] : successfull`)
		process.exit()
	} catch (error) {
		throw new Error('failed to seed database')
	}
}

seed()
