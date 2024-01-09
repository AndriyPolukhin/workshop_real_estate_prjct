import logo from './assets/google_logo.jpg'
import { Layout } from 'antd'
const { Header } = Layout

export const AppHeaderSkeleton = () => {
	return (
		<Header className='app-header-skeleton' style={{ background: 'white' }}>
			<div className='app-header-skeleton__search-section'>
				<div className='app-header-skeleton__logo'>
					<img src={logo} alt='App Logo' />
				</div>
			</div>
		</Header>
	)
}
