import dotenv from 'dotenv'
import { connectDatabase } from '../src/database'
dotenv.config()

const clear = async () => {
	try {
		console.log(`
    🎰 [clear] : running...`)

		const db = await connectDatabase()

		await db.bookings.clear()
		await db.listings.clear()
		await db.users.clear()

		console.log(`
    🏟️ [clear] : successfull`)
		process.exit()
	} catch (error) {
		throw new Error('failed to clear database')
	}
}

clear()
