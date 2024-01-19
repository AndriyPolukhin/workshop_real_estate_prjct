import { Link } from 'react-router-dom'
import { Empty, Layout, Typography, Button } from 'antd'

const { Content } = Layout
const { Text } = Typography
export const NotFound = () => {
	return (
		<Content className='not-found'>
			<Empty
				description={
					<>
						<Text className='not-found__description-title'>
							U&h oh! something went wrong :(
						</Text>
						<Text className='not-found__description-subtitle'>
							The page you're looking from can't be found
						</Text>
					</>
				}
			/>
			<Button type='primary' size='large' className='not-found__cta'>
				<Link to='/'>Go to home</Link>
			</Button>
		</Content>
	)
}
