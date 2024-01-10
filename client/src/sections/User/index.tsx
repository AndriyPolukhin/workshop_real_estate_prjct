import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useViewer } from '../index'
import { USER } from '../../lib/graphql/queries'
import { Viewer } from '../../lib/types'
import { Col, Row, Layout } from 'antd'
import {
	User as UserType,
	UserQuery as UserData,
	UserQueryVariables,
} from '../../lib/graphql/__generated__/graphql'
import { UserProfile, UserListings, UserBookings } from './components'
import { PageSkeleton, ErrorBanner } from '../../lib/components'

interface Props {
	viewer: Viewer
}
interface MatchParams {
	id?: string
}

const { Content } = Layout
const PAGE_LIMIT = 4
export const User = () => {
	const params: MatchParams = useParams()
	const { viewer }: Props = useViewer()
	const [listingsPage, setListingsPage] = useState(1)
	const [bookingsPage, setBookingsPage] = useState(1)
	const { data, loading, error, refetch } = useQuery<
		UserData,
		UserQueryVariables
	>(USER, {
		variables: {
			id: params.id || '',
			bookingsPage,
			listingsPage,
			limit: PAGE_LIMIT,
		},
	})

	const handleUserRefetch = async () => {
		await refetch()
	}

	const stripeError = new URL(window.location.href).searchParams.get(
		'stripe_error'
	)
	const stripeErrorBanner = stripeError ? (
		<ErrorBanner description='We had an issue connecting with Stripe. Please try again later.' />
	) : null

	if (loading) {
		return (
			<Content style={contentStyle}>
				<PageSkeleton />
			</Content>
		)
	}

	if (error) {
		return (
			<Content style={contentStyle}>
				<ErrorBanner description="This user may not exist or we've encountered a problem. Please try again later" />
				<PageSkeleton />
			</Content>
		)
	}

	const user = data ? (data.user as UserType) : null
	const viewerIsUser = viewer.id === params.id

	const userListings = user ? user.listings : null
	const userBookings = user ? user.bookings : null

	const userProfileElement = user ? (
		<UserProfile
			user={user}
			viewerIsUser={viewerIsUser}
			handleUserRefetch={handleUserRefetch}
		/>
	) : null

	const userListingsElement = userListings ? (
		<>
			<UserListings
				userListings={userListings}
				listingsPage={listingsPage}
				limit={PAGE_LIMIT}
				setListingsPage={setListingsPage}
			/>
		</>
	) : null

	const userBookingsElement = userBookings ? (
		<>
			<UserBookings
				userBookings={userBookings}
				bookingsPage={bookingsPage}
				limit={PAGE_LIMIT}
				setBookingsPage={setBookingsPage}
			/>
		</>
	) : null

	return (
		<Content style={contentStyle}>
			{stripeErrorBanner}
			<Row gutter={12} justify='space-between'>
				<Col xs={24}>{userProfileElement}</Col>
				<Col xs={24}>
					{userListingsElement}
					{userBookingsElement}
				</Col>
			</Row>
		</Content>
	)
}

const contentStyle: React.CSSProperties = {
	padding: '60px 120px',
}
