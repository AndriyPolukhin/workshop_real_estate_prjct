import React from 'react'
import { Alert } from 'antd'

interface Props {
	message?: string
	description?: string
}

export const ErrorBanner = ({
	message = 'Uh oh! Something went wrong :(',
	description = 'Looks like something went wrong. Please check your connection and/or try again later',
}: Props) => {
	return (
		<Alert
			banner
			closable
			message={message}
			description={description}
			type='error'
			style={alertBannerStyle}
		/>
	)
}

const alertBannerStyle: React.CSSProperties = {
	position: 'fixed',
	width: '100%',
	top: '64px',
	left: 0,
	zIndex: 99,
}
