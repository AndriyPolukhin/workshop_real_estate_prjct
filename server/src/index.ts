import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from '@apollo/server'
import { resolvers, typeDefs } from './graphql/index.js'
import connectDatabase from './database/index.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

async function startApolloServer() {
	const app = express()
	const httpServer = http.createServer(app)
	const db = await connectDatabase()
	const port = process.env.PORT || 9000
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	})

	await server.start()

	app.use(
		'/api',
		cors<cors.CorsRequest>({
			origin: [`http://localhost:${port}`, 'https://studio.apollographql.com'],
			credentials: true,
		}),
		express.json(),
		cookieParser(process.env.SECRET),
		expressMiddleware(server, {
			context: async ({ req, res }) => ({
				db,
				req,
				res,
			}),
		})
	)

	app.listen(port, () => {
		console.log(`
		🚀  Server is running!
		🎧  Listening on port ${port}
		📭  Query at http://localhost:${port}
		`)
	})
}

startApolloServer()
