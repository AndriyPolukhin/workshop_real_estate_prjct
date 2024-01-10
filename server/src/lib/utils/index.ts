import { Request } from 'express'
import { Database, User } from '../types'

export const authorize = async (
	db: Database,
	req: Request
): Promise<User | null> => {
	// const token =   req.get('X-CSRF-TOKEN')
	const viewerId = await getCookieValue(req.headers.cookie, 'viewer')
	const viewer = await db.users.findOne({
		_id: `${viewerId}`,
		// token,
	})
	return viewer
}

export const getCookieValue = async (
	cookieString: string | undefined,
	cookieName: string
) => {
	const cookies =
		cookieString &&
		cookieString.split(';').map((cookie: string) => cookie.trim().split('='))
	if (cookies) {
		for (const [name, value] of cookies) {
			if (name === cookieName) {
				return decodeURIComponent(value)
			}
		}
	}

	return null
}
