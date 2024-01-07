import { useQuery } from '@apollo/client'
import { Layout, List } from 'antd'
import { ListingCard } from '../../lib/components'
import { LISTINGS } from '../../lib/graphql/queries'
import {
	ListingsQuery as ListingsData,
	ListingsQueryVariables,
} from '../../lib/graphql/__generated__/graphql'
import { ListingsFilter } from '../../lib/graphql/__generated__/graphql'

const PAGE_LIMIT = 8
const { Content } = Layout
export const Listings = () => {
	const { data } = useQuery<ListingsData, ListingsQueryVariables>(LISTINGS, {
		variables: {
			filter: ListingsFilter.PriceHighToLow,
			limit: PAGE_LIMIT,
			page: 1,
			location: 'LA',
		},
	})

	const listings = data ? data.listings : null

	const listingsSectionElement = listings ? (
		<List
			grid={{
				gutter: 8,
				xs: 1,
				sm: 2,
				lg: 4,
			}}
			dataSource={listings.result}
			renderItem={(listing) => (
				<List.Item>
					<ListingCard listing={listing} />
				</List.Item>
			)}
		/>
	) : null
	return (
		<Content>{listings && listings.result && listingsSectionElement}</Content>
	)
}
