import { List, Typography } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { User } from '../../../../lib/graphql/__generated__/graphql'

interface Props {
	userListings: User['listings']
	listingsPage: number
	limit: number
	setListingsPage: (page: number) => void
}

const { Paragraph, Title } = Typography
export const UserListings = ({
	userListings,
	listingsPage,
	limit,
	setListingsPage,
}: Props) => {
	const { total, result } = userListings

	const userListingsList = (
		<List
			grid={{
				gutter: 8,
				xs: 1,
				sm: 2,
				lg: 4,
			}}
			dataSource={result}
			locale={{ emptyText: `User doesn't have any listings yet!` }}
			pagination={{
				position: 'top',
				current: listingsPage,
				total,
				defaultPageSize: limit,
				hideOnSinglePage: true,
				showLessItems: true,
				onChange: (page: number) => setListingsPage(page),
			}}
			renderItem={(userListing) => (
				<List.Item>
					<ListingCard listing={userListing} />
				</List.Item>
			)}
		/>
	)
	return (
		<div style={userListingsStyle}>
			<Title level={4} style={userListingsTitleStyle}>
				Listings
			</Title>
			<Paragraph style={userListingsDescriptionStyle}>
				This section highlights the listings this user currently hosts and has
				made available for bookings.
			</Paragraph>
			{userListingsList}
		</div>
	)
}

const userListingsStyle: React.CSSProperties = {
	paddingTop: '40px',
}
const userListingsTitleStyle: React.CSSProperties = {
	color: '#1d226c',
	display: 'inline-block',
}
const userListingsDescriptionStyle: React.CSSProperties = {
	fontSize: '15px',
}
