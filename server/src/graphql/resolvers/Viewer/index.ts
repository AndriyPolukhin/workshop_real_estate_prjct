import crypto from 'crypto'
import { Google } from '../../../lib/api'
import { Viewer, Database, User } from '../../../lib/types'
import { LogInArgs } from './types'

const LogInViaGoogle = async (
	code: string,
	token: string,
	db: Database
): Promise<User> => {
	const { user } = await Google.logIn(code)

	if (!user) {
		throw new Error('Google login error')
	}

	// * Mame/Photo/Email Lists
	const userNamesList = user.names && user.names.length ? user.names : null
	const userPhotosList = user.photos && user.photos.length ? user.photos : null
	const userEmailsList =
		user.emailAddresses && user.emailAddresses.length
			? user.emailAddresses
			: null

	// * User Display Name
	const userName = userNamesList ? userNamesList[0].displayName : null
	// * User Id
	const userId =
		userNamesList &&
		userNamesList[0].metadata &&
		userNamesList[0].metadata.source
			? userNamesList[0].metadata.source.id
			: null

	// * User Avatar
	const userAvatar =
		userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : ''
	// * User Email
	const userEmail =
		userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : ''

	if (!userName || !userId || !userAvatar || !userEmail) {
		throw new Error('[App] Google login error')
	}

	const updateRes = await db.users.findOneAndUpdate(
		{ _id: userId },
		{
			$set: {
				name: userName,
				avatar: userAvatar,
				contact: userEmail,
				token,
			},
		},
		{ returnDocument: 'after' }
	)

	let viewer = updateRes

	console.log('[resolvers.Viewer] after update: ', viewer)
	if (!viewer) {
		const insertResult = await db.users.insertOne({
			_id: userId,
			token,
			name: userName,
			avatar: userAvatar,
			contact: userEmail,
			income: 0,
			bookings: [],
			listings: [],
		})

		viewer = await db.users.findOne({ _id: insertResult.insertedId })
	}
	return viewer as User
}

export const viewerResolvers = {
	Query: {
		authUrl: (): string => {
			try {
				return Google.authUrl
			} catch (error) {
				throw new Error(`Failed to query Google Auth Url: ${error}`)
			}
		},
	},
	Mutation: {
		logIn: async (
			_root: undefined,
			{ input }: LogInArgs,
			{ db }: { db: Database }
		) => {
			try {
				const code = input ? input.code : null
				const token = crypto.randomBytes(16).toString('hex')

				const viewer: User | undefined = code
					? await LogInViaGoogle(code, token, db)
					: undefined

				if (!viewer) {
					return { didRequest: true }
				}

				return {
					_id: viewer._id,
					token: viewer.token,
					avatar: viewer.avatar,
					walletId: viewer.walletId,
					didRequest: true,
				}
			} catch (error) {
				console.error('Error during logIn Mutation:', error)
				// throw new Error(`[resolvers.Viewer]: Failed to log in: ${error}`)
			}
		},
		logOut: () => {
			try {
				return { didRequest: true }
			} catch (error) {
				console.error('Error during logOut Mutation:', error)
				throw new Error(`Failed to log out: ${error}`)
			}
		},
	},
	Viewer: {
		id: (viewer: Viewer): string | undefined => {
			return viewer._id
		},
		hasWallet: (viewer: Viewer): boolean | undefined => {
			return viewer.walletId ? true : undefined
		},
	},
}

/**

https://accounts.google.com/o/oauth2/v2/auth?access_type=online&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&include_granted_scopes=true&response_type=code&client_id=1038767682985-l7f0cip9k37ig74do0lmc5eovggj4ike.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login

 */
