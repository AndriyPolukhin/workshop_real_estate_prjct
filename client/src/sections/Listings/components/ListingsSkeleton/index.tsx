import { Card, List, Skeleton } from 'antd'
import listingLoadingCardCover from '../../assets/listing-loading-card-cover.jpg'

export const ListingsSkeleton = () => {
	const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}]
	return (
		<div className='listings-skeleton'>
			<Skeleton paragraph={{ rows: 1 }} />
			<List
				grid={{
					gutter: 8,
					xs: 1,
					sm: 2,
					lg: 4,
				}}
				dataSource={emptyData}
				renderItem={() => (
					<List.Item>
						<Card
							cover={
								<div
									className='listings-skeleton__card-cover-img'
									style={{
										backgroundImage: `url(${listingLoadingCardCover})`,
										minWidth: '200px',
									}}
								></div>
							}
							loading
							className='listings-skeleton__card'
						/>
					</List.Item>
				)}
			/>
		</div>
	)
}
