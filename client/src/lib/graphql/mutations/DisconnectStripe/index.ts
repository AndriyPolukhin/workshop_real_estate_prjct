import { gql } from '../../__generated__'

export const DISCONNECT_STRIPE = gql(`
    mutation DisconnectStripe {
        disconnectStripe {
            hasWallet
        }
    }
`)
