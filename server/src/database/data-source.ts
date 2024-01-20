import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'Apptracker_101',
	database: 'realestate',
	synchronize: true,
	logging: true,
	entities: ['src/database/entity/**/*.ts'],
	subscribers: ['src/database/subscriber/**/*.ts'],
	migrations: ['src/database/migration/**/*.ts'],
})
