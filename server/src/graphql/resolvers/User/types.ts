import { Booking } from '../../../lib/types'

export interface UserArgs {
	id: string
}

export interface UserBookingsArgs {
	limit: number
	page: number
}

export interface UserBookingsData {
	total: number
	result: Booking[]
}
