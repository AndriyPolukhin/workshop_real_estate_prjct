import dotenv from 'dotenv'
dotenv.config()
import { connectDatabase } from '../src/database'
import { listings } from './listings'
import { users } from './users'

const seed = async () => {
	try {
		console.log(`
    🎰 [seed] : running...`)

		const db = await connectDatabase()

		for (const listing of listings) {
			await db.listings.create(listing).save()
		}
		for (const user of users) {
			await db.users.create(user).save()
		}

		console.log(`
    🏟️ [seed] : successfull`)
		process.exit()
	} catch (error) {
		throw new Error('failed to seed database')
	}
}

seed()
