import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers, typeDefs } from './graphql/index.js'

async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	const { url } = await startStandaloneServer(server, {
		listen: { port: 9000 },
	})
	console.log(`
🚀  [app]:  Server is running!
📭  [query]: at ${url}
`)
}

startApolloServer()
