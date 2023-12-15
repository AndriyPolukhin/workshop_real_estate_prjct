// * :logo-google
import googleLogo from './assets/google_logo.jpg'
import { Layout, Card, Typography } from 'antd'

const { Content } = Layout
const { Text, Title } = Typography

const contentStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}
const cardStyle: React.CSSProperties = {
	width: '450px',
	textAlign: 'center',
	padding: '10px 0 20px',
}

const introStyle: React.CSSProperties = {
	marginTop: '5px',
}

const googleButtonStyle: React.CSSProperties = {
	margin: '40px auto',
	borderRadius: '2px',
	backgroundColor: '#4285f4',
	boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12)',
	border: 'none',
	display: 'flex',
	alignItems: 'center',
	padding: '1px',
	color: '#fff',
	cursor: 'pointer',
}
const googleButtonTextStyle: React.CSSProperties = {
	textAlign: 'left',
	whiteSpace: 'nowrap',
	padding: '10px',
}

export const Login: React.FC = () => {
	return (
		<Content style={contentStyle}>
			<Card style={cardStyle}>
				<div style={introStyle}>
					<Title level={3} style={introStyle}>
						<span role='img' arria-label='wave'>
							👋
						</span>
					</Title>
					<Title level={3} style={introStyle}>
						Log in to Real Estate!
					</Title>
					<Text>Sign in with Google to start booking available rentals!</Text>
				</div>
				<button style={googleButtonStyle}>
					<img alt='Google Logo' src={googleLogo} style={{ height: '43px' }} />
					<span style={googleButtonTextStyle}>Sign in with Google</span>
				</button>
				<Text type='secondary'>
					Note: By signing in, you'll be redirected to the Google consent form
					to sign in with your Google account.
				</Text>
			</Card>
		</Content>
	)
}
