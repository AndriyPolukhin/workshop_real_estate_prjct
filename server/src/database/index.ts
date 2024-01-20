import 'reflect-metadata'
import { AppDataSource } from './data-source'
import { Database } from '../lib/types'
import { UserEntity, ListingEntity, BookingEntity } from './entity'

export const connectDatabase = async (): Promise<Database> => {
	try {
		const db = await AppDataSource.initialize()

		const bookings = db.getRepository(BookingEntity)
		const listings = db.getRepository(ListingEntity)
		const users = db.getRepository(UserEntity)

		console.log(`		💽  MongoDB Connected to db: `)

		return {
			bookings,
			listings,
			users,
		}
	} catch (error) {
		console.log(`Error: ${error}`)
		process.exit(1)
	}
}

export default connectDatabase
