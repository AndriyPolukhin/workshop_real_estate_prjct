import { gql } from '../../__generated__'

export const LOG_OUT = gql(`
    mutation LogOut($input: LogInInput) {
       logOut {
        id
        token
        avatar
        hasWallet
        didRequest
       }
    }
`)
