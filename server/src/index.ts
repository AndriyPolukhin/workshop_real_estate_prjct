import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers, typeDefs } from './graphql/index.js'
import connectDatabase from './database/index.js'

async function startApolloServer() {
	const db = await connectDatabase()
	const port = process.env.PORT || 9000
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	const { url } = await startStandaloneServer(server, {
		listen: { port: 9000 },
		context: async () => ({
			db,
		}),
	})
	console.log(
		`	🚀  Server is running!
	🎧  Listening on port ${port}
	📭  Query at ${url}
`
	)
}

startApolloServer()
