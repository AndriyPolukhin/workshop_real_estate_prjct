import { gql } from '../../__generated__'

export const LOG_OUT = gql(`
    mutation LogOut {
       logOut {
        id
        token
        avatar
        hasWallet
        didRequest
       }
    }
`)
