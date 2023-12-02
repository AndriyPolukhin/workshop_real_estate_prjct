import { MongoClient } from 'mongodb'

const connectDatabase = async () => {
	try {
		const client = await MongoClient.connect(`${process.env.MONGO_URI}`)

		const db = client.db('main')
		console.log(`MongoDB Connected to db: ${db.namespace}`)

		return {
			listings: db.collection('test_listings'),
		}
	} catch (error) {
		console.log(`Error: ${error}`)
		process.exit(1)
	}
}

export default connectDatabase
