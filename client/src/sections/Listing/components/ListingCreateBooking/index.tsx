import { Button, Card, Typography, Divider, DatePicker } from 'antd'
import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils'
import dayjs, { Dayjs } from 'dayjs'
import { Viewer } from '../../../../lib/types'
import { useViewer } from '../../../App'
import { Listing } from '../../../../lib/graphql/__generated__/graphql'
import { BookingsIndex } from './types'
interface ViewerProps {
	viewer: Viewer
}
const { Paragraph, Title, Text } = Typography
interface Props {
	host: Listing['host']
	price: number
	bookingsIndex: Listing['bookingsIndex']
	checkInDate: Dayjs | null
	checkOutDate: Dayjs | null
	setCheckInDate: (checkInDate: Dayjs | null) => void
	setCheckOutDate: (checkOutDate: Dayjs | null) => void
	setModalVisible: (modalVisible: boolean) => void
}

export const ListingCreateBooking = ({
	host,
	price,
	bookingsIndex,
	checkInDate,
	setCheckInDate,
	checkOutDate,
	setCheckOutDate,
	setModalVisible,
}: Props) => {
	const { viewer }: ViewerProps = useViewer()

	const bookingsIndexJson: BookingsIndex = JSON.parse(bookingsIndex)
	const dateIsBooked = (currentDate: Dayjs) => {
		const year = currentDate.year()
		const month = currentDate.month()
		const day = currentDate.date()

		if (bookingsIndexJson[year] && bookingsIndexJson[year][month]) {
			return Boolean(bookingsIndexJson[year][month][day])
		} else {
			return false
		}
	}
	const disabledDate = (currentDate?: Dayjs) => {
		if (currentDate) {
			const dateIsBeforeEndOfDay = currentDate.isBefore(dayjs().endOf('day'))
			return dateIsBeforeEndOfDay || dateIsBooked(currentDate)
		} else {
			return false
		}
	}

	const verifyAndSetCheckOutDate = (selectedCheckOutDate: Dayjs | null) => {
		if (checkInDate && selectedCheckOutDate) {
			if (dayjs(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
				return displayErrorMessage(
					`You can't book date of check out to be prior to check in!`
				)
			}

			let dateCursor = checkInDate

			while (dateCursor.isBefore(selectedCheckOutDate, 'days')) {
				dateCursor = dateCursor.add(1, 'days')
				const year = dateCursor.year()
				const month = dateCursor.month()
				const day = dateCursor.date()

				if (
					bookingsIndexJson[year] &&
					bookingsIndexJson[year][month] &&
					bookingsIndexJson[year][month][day]
				) {
					displayErrorMessage(
						`You can't book a period of time that overlaps existing bookings. Please try again!`
					)
				}
			}
		}

		setCheckOutDate(selectedCheckOutDate)
	}

	const viewerIsHost = viewer.id === host.id
	const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet
	const checkOutInputDisabled = checkInInputDisabled || !checkInDate
	const buttonDisabled = checkInInputDisabled || !checkInDate || !checkOutDate

	let buttonMessage = `You wan't be charged yet`
	if (!viewer.id) {
		buttonMessage = `You have to be signed in to book a listing!`
	} else if (viewerIsHost) {
		buttonMessage = `You can't book your own listing!`
	} else if (!host.hasWallet) {
		buttonMessage = `The host disconnected from Stripe and thus won't be able to receive payments!`
	}
	return (
		<div style={listingBookingStyle}>
			<Card style={listingBookingCardStyle}>
				<div>
					<Paragraph>
						<Title level={2} style={listingBookingCardTitleStyle}>
							{formatListingPrice(price)}
							<span style={listingBookingCardTitleSpanStyle}>/day</span>
						</Title>
					</Paragraph>
					<Divider />
					<div style={listingBookingCardDatePickerStyle}>
						<Paragraph strong>Check In</Paragraph>
						<DatePicker
							format={'YYYY/MM/DD'}
							disabled={checkInInputDisabled}
							disabledDate={disabledDate}
							showToday={false}
							value={checkInDate}
							onChange={(dateValue) => setCheckInDate(dateValue)}
							onOpenChange={() => setCheckOutDate(null)}
						/>
					</div>
					<div style={listingBookingCardDatePickerStyle}>
						<Paragraph strong>Check Out</Paragraph>
						<DatePicker
							format={'YYYY/MM/DD'}
							disabled={checkOutInputDisabled}
							disabledDate={disabledDate}
							showToday={false}
							value={checkOutDate}
							onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
						/>
					</div>
				</div>
				<Divider />
				<Button
					disabled={buttonDisabled}
					size='large'
					type='primary'
					style={listingBookingCardCTA}
					onClick={() => setModalVisible(true)}
				>
					Request to book!
				</Button>
				<Text type='secondary' mark>
					{buttonMessage}
				</Text>
			</Card>
		</div>
	)
}

const listingBookingStyle: React.CSSProperties = {
	maxWidth: '400px',
	margin: '0 auto',
	display: 'block',
}
const listingBookingCardStyle: React.CSSProperties = {
	width: '100%',
	textAlign: 'center',
}
const listingBookingCardTitleStyle: React.CSSProperties = {
	color: '#1d226c',
	marginBottom: '5px',
}
const listingBookingCardTitleSpanStyle: React.CSSProperties = {
	color: '#bfbfbf',
	fontWeight: '400',
}
const listingBookingCardDatePickerStyle: React.CSSProperties = {
	paddingBottom: '20px',
}
const listingBookingCardCTA: React.CSSProperties = {
	display: 'block',
	margin: '0 auto 10px',
}
