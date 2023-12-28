import { Card, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

interface Props {
	listing: {
		id: string
		title: string
		image: string
		address: string
		price: number
		numOfGuests: number
	}
}

const { Text, Title } = Typography
export const ListingCard = ({ listing }: Props) => {
	const { title, image, address, price, numOfGuests } = listing
	return (
		<Card
			hoverable
			cover={
				<div
					style={{
						backgroundImage: `url(${image})`,
						width: '100%',
						height: '195px',
						backgroundSize: 'cover',
						backgroundPosition: '50%',
					}}
				/>
			}
		>
			<div style={listingCardDetailsStyle}>
				<div style={listingCardDescriptionStyle}>
					<Title level={4} style={listingCardDetailsStyle}>
						{price}
						<span style={listingCardDetailsSpanStyle}>/day</span>
					</Title>
					<Text strong ellipsis style={{ display: 'block' }}>
						{title}
					</Text>
					<Text strong ellipsis style={{ display: 'block' }}>
						{address}
					</Text>
					<div style={listingCardDetailsDimensionsStyle}>
						<UserOutlined />
						<Text>{numOfGuests}</Text>
					</div>
				</div>
			</div>
		</Card>
	)
}

const listingCardDescriptionStyle: React.CSSProperties = {
	paddingBottom: '20px',
}
const listingCardDetailsStyle: React.CSSProperties = {
	color: '#1d226c',
}
const listingCardDetailsSpanStyle: React.CSSProperties = {
	color: '#bfbfbf',
	fontWeight: '400',
}
const listingCardDetailsDimensionsStyle: React.CSSProperties = {
	float: 'right',
	paddingRight: '10px',
	fontSize: '13px',
}
