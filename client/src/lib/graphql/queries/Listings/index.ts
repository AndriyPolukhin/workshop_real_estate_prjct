import { gql } from '../../__generated__'

export const LISTINGS = gql(`
    query Listings($filter: ListingsFilter!, $limit: Int!, $page: Int!) {
        listings(filter: $filter, limit: $limit, page: $page) {
            result {
                id
                title
                image
                address
                price
                numOfGuests
            }
        }
    }
`)
