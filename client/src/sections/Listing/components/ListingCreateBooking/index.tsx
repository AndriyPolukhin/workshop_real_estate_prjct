import { Button, Card, Typography, Divider, DatePicker } from 'antd'
import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils'
import dayjs, { Dayjs } from 'dayjs'

const { Paragraph, Title } = Typography
interface Props {
	price: number
	checkInDate: Dayjs | null
	setCheckInDate: (checkInDate: Dayjs | null) => void
	checkOutDate: Dayjs | null
	setCheckOutDate: (checkOutDate: Dayjs | null) => void
}

export const ListingCreateBooking = ({
	price,
	checkInDate,
	setCheckInDate,
	checkOutDate,
	setCheckOutDate,
}: Props) => {
	const disabledDate = (currentDate?: Dayjs) => {
		if (currentDate) {
			const dateIsBeforeEndOfDay = currentDate.isBefore(dayjs().endOf('day'))
			return dateIsBeforeEndOfDay
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
		}

		setCheckOutDate(selectedCheckOutDate)
	}

	const checkOutInputDisabled = !checkInDate
	const buttonDisabled = !checkInDate || !checkOutDate

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
							disabledDate={disabledDate}
							showToday={false}
							disabled={checkOutInputDisabled}
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
				>
					Request to book!
				</Button>
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
