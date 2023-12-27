import { gql } from '../../__generated__'

export const User = gql(`
    query User($id: ID!) {
        user(id: $id) {
            id
            name
            avatar
            contact
            hasWallet
            income
        }
    }
`)
