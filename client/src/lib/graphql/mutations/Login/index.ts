import { gql } from '../../__generated__'

export const LOG_IN = gql(`
    mutation LogIn($input: LogInInput) {
       logIn(input: $input) {
        id
        token
        avatar
        hasWallet
        didRequest
       }
    }
`)
