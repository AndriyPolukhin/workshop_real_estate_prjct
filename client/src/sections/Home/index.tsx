import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Col, Row, Layout, Typography, Button } from 'antd'
import { displayErrorMessage } from '../../lib/utils'
import { LISTINGS } from '../../lib/graphql/queries'
import {
	ListingsQuery as ListingsData,
	Listings as ListingsType,
	ListingsQueryVariables,
	ListingsFilter,
} from '../../lib/graphql/__generated__/graphql'
import { HomeHero, HomeListings, HomeListingsSkeleton } from './components'

import mapBackground from './assets/map-background.jpg'
import sanFransiscoImage from './assets/san-fransisco.jpg'
import cancunImage from './assets/cancun.jpg'

const { Content } = Layout
const { Title, Paragraph } = Typography

const PAGE_LIMIT = 4
const PAGE_NUMBER = 1

export const Home = () => {
	const { data, loading } = useQuery<ListingsData, ListingsQueryVariables>(
		LISTINGS,
		{
			variables: {
				filter: ListingsFilter.PriceHighToLow,
				limit: PAGE_LIMIT,
				page: PAGE_NUMBER,
			},
		}
	)

	const navigate = useNavigate()
	const onSearch = (value: string) => {
		const trimmedValue = value.trim()

		if (trimmedValue) {
			navigate(`/listings/${trimmedValue}`)
		} else {
			displayErrorMessage('Please enter a valid search')
		}
	}

	const renderListingsSection = () => {
		if (loading) {
			return <HomeListingsSkeleton />
		}

		if (data) {
			return (
				<HomeListings
					title='Premium Listings'
					listings={data.listings.result as ListingsType['result']}
				/>
			)
		}

		return null
	}
	return (
		<Content
			className='home'
			style={{ backgroundImage: `url(${mapBackground})` }}
		>
			<HomeHero onSearch={onSearch} />

			<div className='home__cta-section'>
				<Title level={2} className='home__cta-section-title'>
					Your guide for all things rental
				</Title>
				<Paragraph>
					Helping you make the last decisions in renting last minute locations.
				</Paragraph>
				<Link to='/listings/united%20states'>
					<Button
						type='primary'
						size='large'
						className='home__cta-section-button'
					>
						Popular listings in the United States
					</Button>
				</Link>
			</div>

			{renderListingsSection()}
			<div className='home__listings'>
				<Title level={4} className='home__listings-title'>
					Listings of any kind
				</Title>
				<Row gutter={12}>
					<Col xs={24} sm={12}>
						<Link to='/listings/san%20fransisco'>
							<div className='home__listings-img-cover'>
								<img
									src={sanFransiscoImage}
									alt='San Fransisco'
									className='home__listings-img'
								/>
							</div>
						</Link>
					</Col>
					<Col xs={24} sm={12}>
						<Link to='/listings/cancún'>
							<div className='home__listings-img-cover'>
								<img
									src={cancunImage}
									alt='Cancún'
									className='home__listings-img'
								/>
							</div>
						</Link>
					</Col>
				</Row>
			</div>
		</Content>
	)
}
