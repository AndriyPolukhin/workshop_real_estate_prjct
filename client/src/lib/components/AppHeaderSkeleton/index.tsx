import logo from './assets/google_logo.jpg'
import { Layout } from 'antd'
const { Header } = Layout

export const AppHeaderSkeleton = () => {
	return (
		<Header style={AppHeaderSkeletonStyle}>
			<div style={AppHeaderSkeletonLogoSearchStyle}>
				<div style={AppHeaderSkeletonLogo}>
					<img
						src={logo}
						alt='App Logo'
						style={{
							width: '36px',
						}}
					/>
				</div>
			</div>
		</Header>
	)
}

const AppHeaderSkeletonStyle: React.CSSProperties = {
	display: 'flex',
	background: ' #fff',
	boxShadow: '0 2px 8px #f0f1f2',
	padding: 0,
}

const AppHeaderSkeletonLogoSearchStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	flexGrow: 1,
}

const AppHeaderSkeletonLogo: React.CSSProperties = {
	display: 'inline-block',
	padding: '0 20px',
}
