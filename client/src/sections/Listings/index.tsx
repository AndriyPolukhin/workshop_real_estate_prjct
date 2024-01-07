import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { Layout, List, Typography } from 'antd'
import { ListingCard } from '../../lib/components'
import { LISTINGS } from '../../lib/graphql/queries'
import {
	ListingsQuery as ListingsData,
	ListingsQueryVariables,
} from '../../lib/graphql/__generated__/graphql'
import { ListingsFilter } from '../../lib/graphql/__generated__/graphql'
import { Link } from 'react-router-dom'

const PAGE_LIMIT = 8
const { Content } = Layout
const { Title, Paragraph, Text } = Typography
interface MatchParams {
	location?: string
}
export const Listings = () => {
	const params: MatchParams = useParams()

	const { data } = useQuery<ListingsData, ListingsQueryVariables>(LISTINGS, {
		variables: {
			filter: ListingsFilter.PriceHighToLow,
			limit: PAGE_LIMIT,
			page: 1,
			location: params.location || '',
		},
	})

	const listings = data ? data.listings : null
	const listingsRegion = listings ? listings.region : null

	const listingsSectionElement =
		listings && listings.result.length ? (
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
		) : (
			<div>
				<Paragraph>
					It appears that no listings have yet been cr4eated for{' '}
					<Text mark>"{listingsRegion}"</Text>
				</Paragraph>
				<Paragraph>
					Be the first person to create a{' '}
					<Link to='/host'>listing in this area</Link>
				</Paragraph>
			</div>
		)

	const listingsRegionElement = listingsRegion ? (
		<Title level={3} className='listings__title' style={{ color: '#1d226c' }}>
			Region for "{listingsRegion}"
		</Title>
	) : null
	return (
		<Content>
			{listingsRegionElement}
			{listingsSectionElement}
		</Content>
	)
}
