import StyleContext from '@ant-design/cssinjs'
import { Link } from 'react-router-dom'
import { Card, Col, Row, Input, Typography } from 'antd'

import torontoImage from '../../assets/toronto.jpg'
import dubaiImage from '../../assets/dubai.jpg'
import losAgnelesImage from '../../assets/los-angeles.jpg'
import londonImage from '../../assets/london.jpg'

const { Title } = Typography
const { Search } = Input

export const HomeHero = () => {
	return (
		<div style={{ width: '100%' }}>
			<div
				style={{
					maxWidth: '680px',
				}}
			>
				<Title style={{ color: '#1d226c' }}>
					Find a place you'll love to stay at
				</Title>
				<Search
					placeholder="Search 'San Fransico'"
					size='large'
					enterButton
					style={homeHeroSearchInputStyle}
				/>
			</div>
			<Row gutter={12} style={{ paddingTop: '60px' }}>
				<Col xs={12} md={6}>
					<Link to='/listings/toronto'>
						<Card
							style={homeHeroCardsStyle}
							cover={<img alt='Toronto' src={torontoImage} />}
						>
							Toronto
						</Card>
					</Link>
				</Col>
				<Col xs={12} md={6}>
					<Link to='/listings/dubai'>
						<Card
							style={homeHeroCardsStyle}
							cover={<img alt='Dubai' src={dubaiImage} />}
						>
							Dubai
						</Card>
					</Link>
				</Col>
				<Col xs={0} md={6}>
					<Link to='/listings/los%20angeles'>
						<Card
							style={homeHeroCardsStyle}
							cover={<img alt='Los Angeles' src={losAgnelesImage} />}
						>
							Los Angeles
						</Card>
					</Link>
				</Col>
				<Col xs={0} md={6}>
					<Link to='/listings/london'>
						<Card
							style={{ ...homeHeroCardsStyle, ...homeHeroCardsCoverStyle }}
							cover={<img alt='London' src={londonImage} />}
						>
							London
						</Card>
					</Link>
				</Col>
			</Row>
		</div>
	)
}

const homeHeroSearchInputStyle: React.CSSProperties = {
	border: '1px solid #f0f1f2',
	boxShadow: '0 2px 4px rgba(29, 34, 108, 0.1)',
}

const homeHeroCardsStyle: React.CSSProperties = {
	background: 'transparent',
	cursor: 'pointer',
}

const homeHeroCardsCoverStyle = {
	'.ant-card > div.ant-card-cover .ant-card-cover:before': {
		content: '',
		display: 'block',
		position: 'absolute',
		top: '0',
		bottom: '0',
		left: '0',
		right: '0',
		background: '#1d226c',
		opacity: '0.5',
		transition: 'all 0.3s linear',
	},
	'.ant-card > div.ant-card-cover .ant-card-cover:hover:before': {
		background: 'none ',
	},
	'.ant-card > div.ant-card-cover div.ant-card-body': {
		paddingTop: '0',
		paddingBottom: '0',
		height: '0',
		color: '#fff',
		fontWeight: '700',
		position: 'relative !important',
		bottom: '40px ',
	},
}
