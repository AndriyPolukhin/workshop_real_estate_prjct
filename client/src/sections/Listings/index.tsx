import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams, Link } from 'react-router-dom'
import { Affix, Layout, List, Typography } from 'antd'
import { ListingCard, ErrorBanner } from '../../lib/components'
import { LISTINGS } from '../../lib/graphql/queries'
import {
	ListingsQuery as ListingsData,
	ListingsQueryVariables,
	ListingsFilter,
} from '../../lib/graphql/__generated__/graphql'
import {
	ListingsFilters,
	ListingsPagination,
	ListingsSkeleton,
} from './components'
interface MatchParams {
	location?: string
}
const { Content } = Layout
const { Title, Paragraph, Text } = Typography
const PAGE_LIMIT = 8
export const Listings = () => {
	const params: MatchParams = useParams()
	const [filter, setFilter] = useState(ListingsFilter.PriceHighToLow)
	const [page, setPage] = useState(1)

	const { data, loading, error } = useQuery<
		ListingsData,
		ListingsQueryVariables
	>(LISTINGS, {
		variables: {
			location: params.location || '',
			filter,
			limit: PAGE_LIMIT,
			page,
		},
	})

	if (loading) {
		return (
			<Content className='listings'>
				<ListingsSkeleton />
			</Content>
		)
	}

	if (error) {
		return (
			<Content className='listings'>
				<ErrorBanner description="We couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords" />
			</Content>
		)
	}

	const listings = data ? data.listings : null
	const listingsRegion = listings ? listings.region : null

	const listingsSectionElement =
		listings && listings.result.length ? (
			<div>
				<Affix offsetTop={64}>
					<ListingsPagination
						total={listings.total}
						page={page}
						limit={PAGE_LIMIT}
						setPage={setPage}
					/>
					<ListingsFilters filter={filter} setFilter={setFilter} />
				</Affix>
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
			</div>
		) : (
			<div>
				<Paragraph>
					It appears that no listings have yet been created for{' '}
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
