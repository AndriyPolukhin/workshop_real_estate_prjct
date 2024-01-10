import { gql } from '../../__generated__'

export const CONNECT_STRIPE = gql(`
    mutation ConnectStripe($input: ConnectStripeInput!) {
        connectStripe(input: $input) {
            hasWallet
        }
    }
`)
