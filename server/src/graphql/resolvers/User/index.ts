import { Request } from 'express'
import { Database, User } from '../../../lib/types'
import { authorize } from '../../../lib/utils'
import { UserArgs } from './types'

export const userResolvers = {
	Query: {
		user: async (
			_root: undefined,
			{ id }: UserArgs,
			{ db, req }: { db: Database; req: Request }
		): Promise<User> => {
			try {
				const user = await db.users.findOne({ _id: id })

				if (!user) {
					throw new Error("User can't be found")
				}

				const viewer = await authorize(db, req)
				if (viewer && viewer._id === user._id) {
					user.authorized = true
				}

				return user
			} catch (error) {
				throw new Error(`Failed to query User: ${error}`)
			}
		},
	},
	User: {
		id: (user: User): string => {
			return user._id
		},
		hasWallet: (user: User): boolean => {
			return Boolean(user.walletId)
		},
		income: (user: User): number | null => {
			return user.authorized ? user.income : null
		},
		bookings: () => {},
		listings: () => {},
	},
}
