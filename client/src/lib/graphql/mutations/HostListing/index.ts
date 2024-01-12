import { gql } from '../../__generated__'

export const HOST_LISTING = gql(`
    mutation HostListing($input: HostListingInput!) {
        hostListing(input: $input) {
            id
        }
    }
`)
