// import { useQuery, useMutation } from '../../lib/api'
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '../../__generated__'
import { Alert, Button, List, Avatar, Spin } from 'antd'
import type { ListingsQuery as ListingsData } from '../../__generated__/graphql'
import type { DeleteListingMutation as DeleteListingData } from '../../__generated__/graphql'
import type { DeleteListingMutationVariables as DeleteListingVariables } from '../../__generated__/graphql'
import ListingsSkeleton from './ListingsSkeleton'
// * Adding a GraphQL query
const LISTINGS = gql(`
	query Listings {
		listings {
			id
			title
			image
			address
			price
			numOfGuests
			numOfBeds
			numOfBaths
			rating
		}
	}
`)

const DELETE_LISTING = gql(`
	mutation DeleteListing($id: ID!) {
		deleteListing(id: $id) {
			id
		}
	}
`)

interface Props {
	title: String
}
export const Listings = ({ title }: Props) => {
	const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS)

	const [
		deleteListing,
		{ loading: deleteListingLoading, error: deleteListingError },
	] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

	const handleDeleteListing = async (id: string) => {
		await deleteListing({
			variables: { id: id },
			onCompleted: (data) => {
				console.log(data)
			},
		})
		refetch()
	}

	const listings = data ? data.listings : null
	const listingsList = listings ? (
		<List
			itemLayout='horizontal'
			dataSource={listings}
			renderItem={(listing) => (
				<List.Item
					actions={[
						<Button
							type='primary'
							onClick={() => handleDeleteListing(listing.id)}
						>
							Delete
						</Button>,
					]}
				>
					<List.Item.Meta
						title={listing.title}
						description={listing.address}
						avatar={<Avatar src={listing.image} shape='square' size={48} />}
					/>
				</List.Item>
			)}
		/>
	) : null

	if (loading) {
		return <ListingsSkeleton title={title} />
	}

	if (error) {
		return <ListingsSkeleton title={title} error />
	}

	const deleteListingErrorAlert = deleteListingError ? (
		<Alert
			type='error'
			message='Uh oh! Something went wrong - please try again later :('
			style={{ marginBottom: '20px' }}
		/>
	) : null

	return (
		<div style={{ margin: '20px', maxWidth: '750px' }}>
			<Spin spinning={deleteListingLoading}>
				{deleteListingErrorAlert}
				<h2>{title}</h2>
				{listingsList}
			</Spin>
		</div>
	)
}
