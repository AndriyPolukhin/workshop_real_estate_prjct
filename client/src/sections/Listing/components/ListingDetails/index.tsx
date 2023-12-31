import { Link } from 'react-router-dom'
import { Avatar, Divider, Tag, Typography } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

import { Listing as ListingData } from '../../../../lib/graphql/__generated__/graphql'
import { iconColor } from '../../../../lib/utils'
interface Props {
	listing: ListingData
}

const { Paragraph, Title } = Typography

export const ListingDetails = ({ listing }: Props) => {
	const { title, description, image, type, address, city, numOfGuests, host } =
		listing

	console.log({ listing })
	return (
		<div style={{ fontSize: '15px', padding: '5px 0' }}>
			<div
				style={{
					backgroundImage: `url(${image})`,
					...listingImageStyle,
				}}
			/>

			<div style={{ paddingBottom: '20px' }}>
				<Paragraph type='secondary' ellipsis style={{ margin: '5px 0' }}>
					<Link to={`/listings/${city}`}>
						<EnvironmentOutlined style={{ color: iconColor }} /> {city}
					</Link>
					<Divider type='vertical' />
					{address}
				</Paragraph>
				<Title
					level={3}
					style={{
						marginTop: '5px !important',
						marginBottom: '5px',
						color: '#1d226c',
					}}
				>
					{title}
				</Title>
			</div>
			<Divider />
			<div style={listingDetailsSectionStyle}>
				<Link to={`/user/${host.id}`}>
					<Avatar src={host.avatar} size={64} />
					<Title level={2} style={listingDetailsHostNameStyle}>
						{host.name}
					</Title>
				</Link>
			</div>

			<Divider />
			<div style={listingDetailsSectionStyle}>
				<Title level={4}>About this space</Title>
				<div style={{ paddingBottom: '20px' }}>
					<Tag color='magenta'>{type}</Tag>
					<Tag color='magenta'>{numOfGuests} Guests</Tag>
				</div>
				<Paragraph ellipsis={{ rows: 3, expandable: true }}>
					{description}
				</Paragraph>
			</div>
		</div>
	)
}

const listingImageStyle: React.CSSProperties = {
	width: '100%',
	height: '570px',
	backgroundSize: 'cover',
	backgroundPosition: '50%',
	marginBottom: '20px',
}
const listingDetailsSectionStyle: React.CSSProperties = {
	fontSize: '15px',
	padding: '5px 0',
}
const listingDetailsHostNameStyle: React.CSSProperties = {
	fontFamily: 'Sacramento, cursive',
	display: 'inline-block',
	paddingLeft: '10px',
	position: 'relative',
	top: '5px',
}
