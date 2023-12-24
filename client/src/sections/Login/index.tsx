// * :logo-google
import googleLogo from './assets/google_logo.jpg'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApolloClient, useMutation } from '@apollo/client'
import { ErrorBanner } from '../../lib/components'
import { LOG_IN } from '../../lib/graphql/mutations'
import { AUTH_URL } from '../../lib/graphql/queries'
import {
	LogInMutation as LogInData,
	LogInMutationVariables,
} from '../../lib/graphql/__generated__/graphql'
import { AuthUrlQuery as AuthUrlData } from '../../lib/graphql/__generated__/graphql'
import { Layout, Card, Typography, Spin } from 'antd'
import {
	displayErrorMessage,
	displaySuccessNotification,
} from '../../lib/utils'
import { useViewer } from '../index'

const { Content } = Layout
const { Text, Title } = Typography

export const Login: React.FC = () => {
	const navigate = useNavigate()
	const redirectTo = (id: string | null | undefined) => {
		if (id) {
			return navigate(`/user/${id}`)
		}
	}
	const { setViewer } = useViewer()
	/** Call apollo client to make queries */
	const client = useApolloClient()
	/** LogIn via useMutation with a LogIn GraphQL Mutation */
	const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
		useMutation<LogInData, LogInMutationVariables>(LOG_IN, {
			onCompleted: (data) => {
				if (data && data.logIn) {
					// console.log('Retrieved user data at data.logIn:', data.logIn)
					setViewer({
						id: data.logIn.id || null,
						token: data.logIn.token || null,
						avatar: data.logIn.avatar || null,
						hasWallet: data.logIn.hasWallet || false,
						didRequest: data.logIn.didRequest || false,
					})
					sessionStorage.setItem('token', data.logIn.token || '')
					redirectTo(data.logIn.id)
					displaySuccessNotification("You've successfully logged in!")
				}
			},
		})

	/** refference persist until the component is reloaded */
	const logInRef = useRef(logIn)

	useEffect(() => {
		const code = new URL(window.location.href).searchParams.get('code')

		if (code) {
			logInRef.current({
				variables: {
					input: { code },
				},
			})
		}
	}, [])

	const handleAuthorize = async () => {
		try {
			const { data } = await client.query<AuthUrlData>({
				query: AUTH_URL,
			})
			window.location.href = data.authUrl
		} catch {
			displayErrorMessage(
				"Sorry! We weren't able to log you in. Please try again later!"
			)
		}
	}

	const [isHover, setIsHover] = useState(false)
	const handleMouseEnter = () => {
		setIsHover(true)
	}
	const handleMouseLeave = () => {
		setIsHover(false)
	}
	const googleButtonStyle: React.CSSProperties = {
		margin: '40px auto',
		borderRadius: '2px',
		backgroundColor: isHover ? '#3367d6' : '#4285f4',
		boxShadow: isHover
			? '0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)'
			: '0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12)',
		border: 'none',
		display: 'flex',
		alignItems: 'center',
		padding: '1px',
		color: '#fff',
		cursor: 'pointer',
	}

	if (logInLoading) {
		return (
			<Content style={contentStyle}>
				<Spin size='large' />
			</Content>
		)
	}

	const logInErrorBannerElement =
		!logInData && logInError ? (
			<ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
		) : null

	return (
		<Content style={contentStyle}>
			{logInErrorBannerElement}
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
				<button
					style={googleButtonStyle}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={handleAuthorize}
				>
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

const googleButtonTextStyle: React.CSSProperties = {
	textAlign: 'left',
	whiteSpace: 'nowrap',
	padding: '10px',
}
