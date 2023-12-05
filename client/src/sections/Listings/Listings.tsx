import { server } from '../../lib/api'
import {
	ListingsData,
	DeleteListingData,
	DeleteListingVariables,
} from './types'
// * Adding a GraphQL query
const LISTINGS = `
    query Listings {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`

const DELETE_LISTING = `
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`

interface Props {
	title: String
}
export const Listings = ({ title }: Props) => {
	const fetchListings = async () => {
		const { data } = await server.fetch<ListingsData>({ query: LISTINGS })

		return data
	}

	const deleteListing = async () => {
		const { data } = await server.fetch<
			DeleteListingData,
			DeleteListingVariables
		>({
			query: DELETE_LISTING,
			variables: {
				id: '656cfc40e6056b602d997d05',
			},
		})

		return data
	}

	return (
		<div>
			<h2>{title}</h2>
			<button onClick={fetchListings}>Query Listings!</button>
			<button onClick={deleteListing}>Delete a Listing</button>
		</div>
	)
}
