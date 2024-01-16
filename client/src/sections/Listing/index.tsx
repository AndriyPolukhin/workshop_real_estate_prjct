import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { Layout, Col, Row } from 'antd'
import { LISTING } from '../../lib/graphql/queries'
import {
	ListingQuery as ListingData,
	Listing as ListingType,
	ListingQueryVariables,
} from '../../lib/graphql/__generated__/graphql'

import {
	ListingDetails,
	ListingBookings,
	ListingCreateBooking,
	ListingCreateBookingModal,
} from './components'

import { Dayjs } from 'dayjs'

interface MatchParams {
	id?: string
}

const PAGE_LIMIT = 3
const { Content } = Layout
export const Listing = () => {
	const params: MatchParams = useParams()
	const [bookingsPage, setBookingsPage] = useState(1)
	const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
	const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
	const [modalVisible, setModalVisible] = useState(false)
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

	const listing = data ? (data.listing as ListingType) : null
	const listingBookings = listing ? listing.bookings : null

	const listingDetailsElement = listing ? (
		<ListingDetails listing={listing} />
	) : null

	const listingBookingsElement = listingBookings ? (
		<ListingBookings
			listingBookings={listingBookings}
			bookingsPage={bookingsPage}
			limit={PAGE_LIMIT}
			setBookingsPage={setBookingsPage}
		/>
	) : null

	const listingCreateBookingElement = listing ? (
		<ListingCreateBooking
			host={listing.host}
			price={listing.price}
			bookingsIndex={listing.bookingsIndex}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			setCheckInDate={setCheckInDate}
			setCheckOutDate={setCheckOutDate}
			setModalVisible={setModalVisible}
		/>
	) : null

	const listingCreateBookingModalElement =
		listing && checkInDate && checkOutDate ? (
			<ListingCreateBookingModal
				price={listing.price}
				checkInDate={checkInDate}
				checkOutDate={checkOutDate}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			/>
		) : null

	return (
		<Content style={{ padding: '60px 120px' }}>
			<Row gutter={24} justify='space-between'>
				<Col xs={24} lg={14} flex='auto'>
					{listingDetailsElement}
					{listingBookingsElement}
				</Col>
				<Col xs={24} lg={10}>
					{listingCreateBookingElement}
				</Col>
			</Row>
			{listingCreateBookingModalElement}
		</Content>
	)
}
