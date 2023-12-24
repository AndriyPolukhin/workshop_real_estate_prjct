import { useState, useEffect, useRef } from 'react'
import { Viewer } from '../../lib/types'
import { Outlet, useOutletContext } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { LOG_IN } from '../../lib/graphql/mutations'
import {
	LogInMutation as LogInData,
	LogInMutationVariables,
} from '../../lib/graphql/__generated__/graphql'
import { Layout, Affix, Spin } from 'antd'
import { AppHeader } from '../../sections'
import { AppHeaderSkeleton, ErrorBanner } from '../../lib/components'

const initialViewer: Viewer = {
	id: null,
	token: null,
	avatar: null,
	hasWallet: null,
	didRequest: false,
}
interface ViewerType {
	setViewer: (viewer: Viewer) => void
}
export const App = () => {
	const [viewer, setViewer] = useState<Viewer>(initialViewer)
	const [logIn, { error }] = useMutation<LogInData, LogInMutationVariables>(
		LOG_IN,
		{
			onCompleted: (data) => {
				if (data && data.logIn) {
					console.log('Retrieved user data at data.logIn:', data.logIn)
					setViewer({
						id: data.logIn.id || null,
						token: data.logIn.token || null,
						avatar: data.logIn.avatar || null,
						hasWallet: data.logIn.hasWallet || false,
						didRequest: data.logIn.didRequest || false,
					})
				}
			},
		}
	)

	const logInRef = useRef(logIn)
	useEffect(() => {
		logInRef.current()
	}, [])

	if (!viewer.didRequest && !error) {
		return (
			<Layout
				style={{
					height: '100%',
					background: '#fff',
					display: 'flex',
				}}
			>
				<AppHeaderSkeleton />
				<div
					style={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Spin size='large' />
				</div>
			</Layout>
		)
	}

	const logInErrorBannerElement =
		!viewer && error ? (
			<ErrorBanner description="We weren't able to verify if you were logged in. Please try again later" />
		) : null

	return (
		<Layout
			id='app'
			style={{
				position: 'relative',
				background: '#fff',
				minHeight: '100vh',
			}}
		>
			{logInErrorBannerElement}
			<Affix
				offsetTop={0}
				style={{
					zIndex: 99,
				}}
			>
				<AppHeader viewer={viewer} setViewer={setViewer} />
			</Affix>
			<Outlet context={{ setViewer }} />
		</Layout>
	)
}

export const useViewer = () => {
	return useOutletContext<ViewerType>()
}
