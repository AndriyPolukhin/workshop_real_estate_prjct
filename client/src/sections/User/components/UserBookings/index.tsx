import { List, Typography } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { User } from '../../../../lib/graphql/__generated__/graphql'

interface Props {
	userBookings: User['bookings']
	bookingsPage: number
	limit: number
	setBookingsPage: (page: number) => void
}

const { Paragraph, Title, Text } = Typography

export const UserBookings = ({
	userBookings,
	bookingsPage,
	limit,
	setBookingsPage,
}: Props) => {
	const total = userBookings ? userBookings.total : null
	const result = userBookings ? userBookings.result : null

	const userBookingsList = userBookings ? (
		<List
			grid={{
				gutter: 8,
				xs: 1,
				sm: 2,
				lg: 4,
			}}
			dataSource={result ? result : undefined}
			locale={{ emptyText: `You haven't made any bookings!` }}
			pagination={{
				position: 'top',
				current: bookingsPage,
				total: total ? total : undefined,
				defaultPageSize: limit,
				hideOnSinglePage: true,
				showLessItems: true,
				onChange: (page: number) => setBookingsPage(page),
			}}
			renderItem={(userBooking) => {
				const bookingHistory = (
					<div style={{ marginBottom: '20px' }}>
						<div>
							Check in: <Text strong>{userBooking.checkIn}</Text>
						</div>
						<div>
							Check out: <Text strong>{userBooking.checkOut}</Text>
						</div>
					</div>
				)

				return (
					<List.Item>
						{bookingHistory}
						<ListingCard listing={userBooking.listing} />
					</List.Item>
				)
			}}
		/>
	) : null

	const userBookingsElement = userBookingsList ? (
		<div style={userBookingsStyle}>
			<Title level={4} style={userBookingsTitleStyle}>
				Bookings
			</Title>
			<Paragraph style={userBookingsDescriptionStyle}>
				This section highlights the bookings you've made, and the
				check-in/check-out dates associated with said bookings.
			</Paragraph>
			{userBookingsList}
		</div>
	) : null

	return userBookingsElement
}

const userBookingsStyle: React.CSSProperties = {
	paddingTop: '40px',
}
const userBookingsTitleStyle: React.CSSProperties = {
	color: '#1d226c',
	display: 'inline-block',
}
const userBookingsDescriptionStyle: React.CSSProperties = {
	fontSize: '15px',
}
