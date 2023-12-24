import dotenv from 'dotenv'
dotenv.config()
import { google } from 'googleapis'

/** provide env variables to google auth OAuth2 */
const auth = new google.auth.OAuth2(
	process.env.G_CLIENT_ID,
	process.env.G_CLIENT_SECRET,
	`${process.env.PUBLIC_URL}/login`
)

export const Google = {
	authUrl: auth.generateAuthUrl({
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/user.emails.read',
		],
		include_granted_scopes: true,
	}),
	logIn: async (code: string) => {
		const { tokens } = await auth.getToken(code)
		// console.log('Retrieved user tokens:', tokens)
		auth.setCredentials(tokens)

		const { data } = await google.people({ version: 'v1', auth }).people.get({
			resourceName: 'people/me',
			personFields: 'emailAddresses,names,photos',
		})

		return { user: data }
	},
}
