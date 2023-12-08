import { Alert, Skeleton, Divider } from 'antd'

interface Props {
	title: String
	error?: Boolean
}

const ListingsSkeleton = ({ title, error = false }: Props) => {
	const errorAlert = error ? (
		<Alert
			type='error'
			message='Uh oh! Something went wrong - please try again later :('
			style={{ marginBottom: '20px' }}
		/>
	) : null

	return (
		<div style={{ margin: '20px', maxWidth: '750px' }}>
			{errorAlert}
			<h2
				style={{
					marginTop: '12px',
				}}
			>
				{title}
			</h2>
			<Skeleton
				active
				paragraph={{ rows: 1 }}
				style={{
					marginTop: '12px',
				}}
			/>
			<Divider style={{ margin: '12px 0' }} />
			<Skeleton
				active
				paragraph={{ rows: 1 }}
				style={{
					marginTop: '12px',
				}}
			/>
			<Divider style={{ margin: '12px 0' }} />
			<Skeleton
				active
				paragraph={{ rows: 1 }}
				style={{
					marginTop: '12px',
				}}
			/>
		</div>
	)
}

export default ListingsSkeleton
