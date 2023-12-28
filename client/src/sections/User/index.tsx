import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useViewer } from '../index'
import { USER } from '../../lib/graphql/queries'
import { Viewer } from '../../lib/types'
import { Col, Row, Layout } from 'antd'
import {
	UserQuery as UserData,
	UserQueryVariables,
} from '../../lib/graphql/__generated__/graphql'
import { UserProfile } from './components'
import { PageSkeleton, ErrorBanner } from '../../lib/components'

interface Props {
	viewer: Viewer
}
interface MatchParams {
	id?: string
}

const { Content } = Layout
export const User = () => {
	const params: MatchParams = useParams()
	const { viewer }: Props = useViewer()
	const { data, loading, error } = useQuery<UserData, UserQueryVariables>(
		USER,
		{
			variables: {
				id: params.id || '',
			},
		}
	)

	if (loading) {
		return (
			<Content style={contentStyle}>
				<PageSkeleton />
			</Content>
		)
	}

	if (error) {
		return (
			<Content style={contentStyle}>
				<ErrorBanner description="This user may not exist or we've encountered a problem. Please try again later" />
				<PageSkeleton />
			</Content>
		)
	}

	const user = data ? data.user : null
	const viewerIsUser = viewer.id === params.id
	const userProfileElement = user ? (
		<UserProfile user={user} viewerIsUser={viewerIsUser} />
	) : null
	return (
		<Content style={contentStyle}>
			<Row gutter={12} justify='space-between'>
				<Col xs={24}>{userProfileElement}</Col>
			</Row>
		</Content>
	)
}

const contentStyle: React.CSSProperties = {
	padding: '60px 120px',
}
