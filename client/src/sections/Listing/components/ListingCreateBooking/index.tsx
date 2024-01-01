import { formatListingPrice } from '../../../../lib/utils'
import { Button, Card, Typography, Divider } from 'antd'
const { Paragraph, Text, Title } = Typography

interface Props {
	price: number
}

export const ListingCreateBooking = ({ price }: Props) => {
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
					</div>
					<div style={listingBookingCardDatePickerStyle}>
						<Paragraph strong>Check Out</Paragraph>
					</div>
				</div>
				<Divider />
				<Button size='large' type='primary' style={listingBookingCardCTA}>
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
