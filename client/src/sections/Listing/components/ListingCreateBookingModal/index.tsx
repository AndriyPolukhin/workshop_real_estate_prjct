import {
	CardElement,
	PaymentElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js'
import { Modal, Button, Divider, Typography } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import { formatListingPrice } from '../../../../lib/utils'
interface Props {
	price: number
	checkInDate: Dayjs
	checkOutDate: Dayjs
	modalVisible: boolean
	setModalVisible: (modalVisible: boolean) => void
}

const { Paragraph, Text, Title } = Typography

export const ListingCreateBookingModal = ({
	price,
	checkInDate,
	checkOutDate,
	modalVisible,
	setModalVisible,
}: Props) => {
	const stripe = useStripe()
	const elements = useElements()

	const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1
	const listingPrice = price * daysBooked

	const handleCreateBooking = async (event: { preventDefault: () => void }) => {
		event.preventDefault()
		if (!stripe || !elements) {
			console.log('Stripe.js has not yet loaded.')
			return
		}
		console.log('Stripe.js is loaded')
		console.log(stripe)
		const result = await stripe.confirmPayment({
			//`Elements` instance that was used to create the Payment Element
			elements,
			confirmParams: {
				return_url: 'https://example.com/order/123/complete',
			},
		})
		console.log(result)
	}

	return (
		<Modal
			open={modalVisible}
			centered
			footer={null}
			onCancel={() => setModalVisible(false)}
		>
			<div className='listing-booking-modal'>
				<div className='listing-booking-modal__intro'>
					<Title className='listing-booking-modal__intro-title'>
						<KeyOutlined />
					</Title>
					<Title level={3} className='listing-booking-modal__intro-title'>
						Book your trip
					</Title>
					<Paragraph>
						Enter your payment information to book the listing from the dates
						between{' '}
						<Text strong mark>
							{checkInDate.format('MMMM Do YYYY')}
						</Text>{' '}
						and{' '}
						<Text strong mark>
							{checkOutDate.format('MMMM Do YYYY')}
						</Text>
						, inclusive.
					</Paragraph>
				</div>
				<Divider />
				<div className='listing-booking-modal__charge-summary'>
					<Paragraph>
						{formatListingPrice(price, false)} * {daysBooked} days ={' '}
						<Text strong>{formatListingPrice(listingPrice, true)}</Text>
					</Paragraph>

					<Paragraph className='listing-booking-modal__charge-summary-total'>
						Total = <Text mark>{formatListingPrice(listingPrice)}</Text>
					</Paragraph>
				</div>

				<Divider />
				<div className='listing-booking-modal__stripe-card-section'>
					<PaymentElement className='listing_booking-modal__stripe-card' />

					<Divider />
					<Button
						type='primary'
						size='large'
						className='listing-booking-modal__cta'
						onClick={handleCreateBooking}
					>
						Book
					</Button>
				</div>
			</div>
		</Modal>
	)
}
