import { Select, Space } from 'antd'
import { ListingsFilter } from '../../../../lib/graphql/__generated__/graphql'

interface Props {
	filter: ListingsFilter
	setFilter: (filter: ListingsFilter) => void
}

export const ListingsFilters = ({ filter, setFilter }: Props) => {
	return (
		<div className='listings-filters'>
			<span>Filter By</span>
			<Space wrap>
				<Select
					style={{ maxWidth: '200px' }}
					defaultValue={filter}
					onChange={(filter: ListingsFilter) => setFilter(filter)}
					options={[
						{
							value: ListingsFilter.PriceLowToHigh,
							label: 'Price: Low To High',
						},
						{
							value: ListingsFilter.PriceHighToLow,
							label: 'Price: High To Low',
						},
					]}
				/>
			</Space>
		</div>
	)
}
