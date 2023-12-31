import { Link } from 'react-router-dom'
import { Avatar, Divider, List, Typography } from 'antd'
import { Listing } from '../../../../lib/graphql/__generated__/graphql'

interface Props {
	listingBookings: Listing['bookings']
	bookingsPage: number
	limit: number
	setBookingsPage: (page: number) => void
}

const { Text, Title } = Typography

export const ListingBookings = ({
	listingBookings,
	bookingsPage,
	limit,
	setBookingsPage,
}: Props) => {
	const total = listingBookings ? listingBookings.total : null
	const result = listingBookings ? listingBookings.result : null

	const listingBookingsList = listingBookings ? (
		<List
			grid={{ gutter: 8, xs: 1, sm: 2, lg: 3 }}
			dataSource={result ? result : undefined}
			locale={{ emptyText: 'No bookings have been made yet!' }}
			pagination={{
				current: bookingsPage,
				total: total ? total : undefined,
				defaultPageSize: limit,
				hideOnSinglePage: true,
				showLessItems: true,
				onChange: (page: number) => setBookingsPage(page),
			}}
			renderItem={(listingBooking) => {
				const bookingHistory = (
					<div style={{ marginBottom: '20px' }}>
						<div style={{ fontSize: '13px', marginBottom: '5px' }}>
							Check In: <Text strong>{listingBooking.checkIn}</Text>
						</div>
						<div style={{ fontSize: '13px', marginBottom: '5px' }}>
							Check out: <Text strong>{listingBooking.checkOut}</Text>
						</div>
					</div>
				)
				return (
					<List.Item style={{ margin: '20px 0' }}>
						{bookingHistory}
						<Link to={`/user/${listingBooking.tenant.id}`}>
							<Avatar
								src={listingBooking.tenant.avatar}
								size={64}
								shape='square'
							/>
						</Link>
					</List.Item>
				)
			}}
		/>
	) : null

	const listingBookingsElement = listingBookingsList ? (
		<div style={listingBookingsStyle}>
			<Divider />
			<div style={listingBookingsSectionStyle}>
				<Title level={4}>Bookings</Title>
			</div>
			{listingBookingsList}
		</div>
	) : null

	return listingBookingsElement
}

const listingBookingsStyle: React.CSSProperties = {
	paddingTop: '40px',
}
const listingBookingsSectionStyle: React.CSSProperties = {
	fontSize: '15px',
	padding: '5px 0',
}
