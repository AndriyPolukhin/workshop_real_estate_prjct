export interface CreateBookingInput {
	id: string
	source: string
	checkIn: string
	checkOut: string
}

export interface CreateBookingsArgs {
	input: CreateBookingInput
}
