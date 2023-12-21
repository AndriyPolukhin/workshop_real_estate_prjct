import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import logo from './assets/google_logo.jpg'
import { MenuItems } from './components/MenuItems'
import { Viewer } from '../../lib/types'

const { Header } = Layout

interface Props {
	viewer: Viewer
}

export const AppHeader = ({ viewer }: Props) => {
	return (
		<Header style={AppHeaderStyle}>
			<div style={AppHeaderLogoSearchStyle}>
				<div style={AppHeaderLogo}>
					<Link to='/'>
						<img
							src={logo}
							alt='App Logo'
							style={{
								width: '36px',
							}}
						/>
					</Link>
				</div>
			</div>
			<div style={AppHeaderMenuSection}>
				<MenuItems viewer={viewer} />
			</div>
		</Header>
	)
}

const AppHeaderStyle: React.CSSProperties = {
	display: 'flex',
	background: ' #fff',
	boxShadow: '0 2px 8px #f0f1f2',
	padding: 0,
}

const AppHeaderLogoSearchStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	flexGrow: 1,
}

const AppHeaderLogo: React.CSSProperties = {
	display: 'inline-block',
	padding: '0 20px',
}

const AppHeaderMenuSection: React.CSSProperties = {
	float: 'right',
}
