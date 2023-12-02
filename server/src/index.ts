import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers, typeDefs } from './graphql/index.js'
import dotenv from 'dotenv'
import connectDatabase from './database/index.js'

dotenv.config()

async function startApolloServer() {
	const db = await connectDatabase()
	const port = process.env.PORT || 9000
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	const { url } = await startStandaloneServer(server, {
		listen: { port: 9000 },
		context: async () => {
			return {
				database_collection: db,
			}
		},
	})
	console.log(`
    🚀  Server is running!
    🎧  Listening on port ${port}
    📭  Query at ${url}
`)

	// * testing collection access
	// const listings = await db.listings.find({}).toArray()
	// console.log(listings)
}

startApolloServer()
