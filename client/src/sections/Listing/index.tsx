import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { Layout } from 'antd'
import { LISTING } from '../../lib/graphql/queries'
import {
	ListingQuery as ListingData,
	ListingQueryVariables,
} from '../../lib/graphql/__generated__/graphql'

interface MatchParams {
	id?: string
}

const PAGE_LIMIT = 3
const { Content } = Layout
export const Listing = () => {
	const params: MatchParams = useParams()
	const [bookingsPage, setBookingsPage] = useState(1)
	const { data, loading, error } = useQuery<ListingData, ListingQueryVariables>(
		LISTING,
		{
			variables: {
				id: params.id || '',
				bookingsPage,
				limit: PAGE_LIMIT,
			},
		}
	)

	if (loading) {
		return (
			<Content style={{ padding: '60px 120px' }}>
				<PageSkeleton />
			</Content>
		)
	}
	if (error) {
		return (
			<Content style={{ padding: '60px 120px' }}>
				<ErrorBanner description="This listing may not exist or we've encountered an error. Please try again later" />
				<PageSkeleton />
			</Content>
		)
	}

	const listing = data ? data.listing : null
	const listingBookings = listing ? listing.bookings : null
	return <div>Listing</div>
}
