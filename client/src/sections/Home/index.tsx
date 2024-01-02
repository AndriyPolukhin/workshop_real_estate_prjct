import { Layout } from 'antd'
import { HomeHero } from './components'

const { Content } = Layout
export const Home = () => {
	return (
		<Content style={homeStyle}>
			<HomeHero />
		</Content>
	)
}

const homeStyle: React.CSSProperties = {
	padding: '60px 120px',
	backgroundImage: './assets/map-background.jpg',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: '10% 0',
}
