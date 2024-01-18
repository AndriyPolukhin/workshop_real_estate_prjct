import { useMutation } from '@apollo/client'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Modal, Button, Divider, Typography } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import {
	formatListingPrice,
	displaySuccessNotification,
	displayErrorMessage,
} from '../../../../lib/utils'
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations/CreateBooking'
import {
	CreateBookingMutation as CreateBookingData,
	CreateBookingMutationVariables,
} from '../../../../lib/graphql/__generated__/graphql'

interface Props {
	id: string
	price: number
	checkInDate: Dayjs
	checkOutDate: Dayjs
	modalVisible: boolean
	setModalVisible: (modalVisible: boolean) => void
	clearBookingData: () => void
	handleListingRefetch: () => Promise<void>
}

const { Paragraph, Text, Title } = Typography

export const ListingCreateBookingModal = ({
	id,
	price,
	checkInDate,
	checkOutDate,
	modalVisible,
	setModalVisible,
	clearBookingData,
	handleListingRefetch,
}: Props) => {
	const stripe = useStripe()
	const elements = useElements()

	const [createBooking, { loading }] = useMutation<
		CreateBookingData,
		CreateBookingMutationVariables
	>(CREATE_BOOKING, {
		onCompleted: () => {
			clearBookingData()
			displaySuccessNotification(
				`You successfully booked a listing!`,
				`Booking history can always be found in your User page`
			)
			handleListingRefetch()
		},
		onError: () => {
			displayErrorMessage(
				`Sorry! You weren't able to book this listing. Please try again later!`
			)
		},
	})

	const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1
	const listingPrice = price * daysBooked

	const handleCreateBooking = async (event: { preventDefault: () => void }) => {
		event.preventDefault()

		if (!stripe || !elements) {
			console.log('Stripe.js has not yet loaded.')
			return displayErrorMessage(
				`Sorry! We weren't able to connect with Stripe`
			)
		}

		// TODO: remove this temporary data
		const { token: stripeToken, error } = {
			token: 'tok_amex',
			error: { message: null },
		}

		if (stripeToken) {
			createBooking({
				variables: {
					input: {
						id,
						source: stripeToken,
						checkIn: checkInDate.format('YYYY-MM-DD'),
						checkOut: checkOutDate.format('YYYY-MM-DD'),
					},
				},
			})
		} else {
			displayErrorMessage(
				error && error.message
					? error.message
					: `Sorry! We weren't able to book the listing. Please try again later`
			)
		}
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
					<CardElement
						className='listing_booking-modal__stripe-card'
						id='card'
					/>

					<Divider />
					<Button
						type='primary'
						size='large'
						className='listing-booking-modal__cta'
						onClick={handleCreateBooking}
						loading={loading}
					>
						Book
					</Button>
				</div>
			</div>
		</Modal>
	)
}
