import { Avatar, Card, Divider, Tag, Typography, Button } from 'antd'
import { useMutation } from '@apollo/client'
import {
	formatListingPrice,
	displayErrorMessage,
	displaySuccessNotification,
} from '../../../../lib/utils'
import {
	User as UserData,
	DisconnectStripeMutation as DisconnectStripeData,
} from '../../../../lib/graphql/__generated__/graphql'
import { DISCONNECT_STRIPE } from '../../../../lib/graphql/mutations'
import { Viewer } from '../../../../lib/types'
import { useViewer } from '../../../App'
interface Props {
	user: UserData
	viewerIsUser: boolean
	handleUserRefetch: () => Promise<void>
}

interface ViewerProps {
	viewer: Viewer
	setViewer: (viewer: Viewer) => void
}
const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write&redirect_uri=http://localhost:3000/stripe`

const { Paragraph, Text, Title } = Typography
export const UserProfile = ({
	user,
	viewerIsUser,
	handleUserRefetch,
}: Props) => {
	const { viewer, setViewer }: ViewerProps = useViewer()
	const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
		DISCONNECT_STRIPE,
		{
			onCompleted: (data) => {
				if (data && data.disconnectStripe) {
					setViewer({
						...viewer,
						hasWallet: data.disconnectStripe.hasWallet || false,
					})
					displaySuccessNotification(
						"You've successfully disconnected from Stripe",
						"You'll have to reconnect with Stripe to continue to create listings"
					)
					handleUserRefetch()
				}
			},
			onError: () => {
				displayErrorMessage(
					`Sorry! We weren't able to disconnect you from Stripe. Please try again later.`
				)
			},
		}
	)

	const redirectToStripe = () => {
		window.location.href = stripeAuthUrl
	}

	const additionalDetails = user.hasWallet ? (
		<>
			<Paragraph>
				<Tag color='green'>Stripe Registered</Tag>
			</Paragraph>
			<Paragraph>
				Income Earned:{' '}
				<Text strong>
					{user.income ? formatListingPrice(user.income) : `$0`}
				</Text>
			</Paragraph>
			<Button
				type='primary'
				style={userProfileDetailsCTAStyle}
				loading={loading}
				onClick={() => disconnectStripe()}
			>
				Disconnect Stripe
			</Button>
			<Paragraph type='secondary'>
				By disconnecting, you won't be able to recieve{' '}
				<Text strong>any further payments</Text>. This will prevent user from
				booking listngs that you might have already created.
			</Paragraph>
		</>
	) : (
		<>
			<Paragraph>
				Interested in becoming, Real Estate host? Register with your Stripe
				account!
			</Paragraph>
			<Button
				type='primary'
				style={userProfileDetailsCTAStyle}
				onClick={redirectToStripe}
			>
				Connect with Stripe
			</Button>
			<Paragraph type='secondary'>
				Real Estate uses{' '}
				<a
					href='https://stripe.com/en-US/connect'
					target='_blank'
					rel='noopener noreferrer'
				>
					Stripe
				</a>{' '}
				to help transfer your earnings in a secure and trusted manner
			</Paragraph>
		</>
	)
	const additionalDetailsSection = viewerIsUser ? (
		<>
			<Divider />
			<div style={userProfileDetailsStyle}>
				<Title level={4} style={{ color: '#1d226c' }}>
					Additional Details
				</Title>
				{additionalDetails}
			</div>
		</>
	) : null

	return (
		<div style={userProfileStyle}>
			<Card style={userProfileCardStyle}>
				<div style={userProfileAvatarStyle}>
					<Avatar size={100} src={user.avatar} />
				</div>
				<Divider />
				<div style={userProfileDetailsStyle}>
					<Title style={{ color: '#1d226c' }} level={4}>
						Details
					</Title>
					<Paragraph>
						Name: <Text strong>{user.name}</Text>
					</Paragraph>
					<Paragraph>
						Contact: <Text strong>{user.contact}</Text>
					</Paragraph>
				</div>
				{additionalDetailsSection}
			</Card>
		</div>
	)
}

const userProfileStyle: React.CSSProperties = {
	maxWidth: '400px',
	margin: '0 auto',
	display: 'block',
}

const userProfileCardStyle: React.CSSProperties = {
	width: '100%',
}
const userProfileAvatarStyle: React.CSSProperties = {
	textAlign: 'center',
}
const userProfileDetailsStyle: React.CSSProperties = {
	fontSize: '15px',
}
const userProfileDetailsCTAStyle: React.CSSProperties = {
	marginBottom: '20px',
}
