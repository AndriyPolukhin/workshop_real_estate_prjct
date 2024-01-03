import { Listings } from '../../../../lib/graphql/__generated__/graphql'
import { List, Typography } from 'antd'
import { ListingCard } from '../../../../lib/components'

interface Props {
	title: string
	listings: Listings['result']
}

const { Title } = Typography

export const HomeListings = ({ title, listings }: Props) => {
	return (
		<div className='home-listings'>
			<Title level={4} className='home-listings__title'>
				{title}
			</Title>
			<List
				grid={{
					gutter: 6,
					xs: 1,
					sm: 2,
					lg: 4,
				}}
				dataSource={listings}
				renderItem={(listing) => (
					<List.Item>
						<ListingCard listing={listing} />
					</List.Item>
				)}
			/>
		</div>
	)
}
