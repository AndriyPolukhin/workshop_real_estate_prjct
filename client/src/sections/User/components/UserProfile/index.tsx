import { Avatar, Card, Divider, Typography, Button } from 'antd'
import { User as UserData } from '../../../../lib/graphql/__generated__/graphql'

interface Props {
	user: UserData
	viewerIsUser: boolean
}
const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write&redirect_uri=http://localhost:3000/stripe`

const { Paragraph, Text, Title } = Typography
export const UserProfile = ({ user, viewerIsUser }: Props) => {
	const redirectToStripe = () => {
		window.location.href = stripeAuthUrl
	}
	const additionalDetailsSection = viewerIsUser ? (
		<>
			<Divider />
			<div style={userProfileDetailsStyle}>
				<Title level={4} style={{ color: '#1d226c' }}>
					Additional Details
				</Title>
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
