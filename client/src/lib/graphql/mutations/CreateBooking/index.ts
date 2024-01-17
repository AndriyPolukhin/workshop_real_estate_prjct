import { gql } from '../../__generated__'

export const CREATE_BOOKING = gql(`
    mutation CreateBooking($input: CreateBookingInput!) {
        createBooking(input: $input) {
            id
        }
    }
`)
