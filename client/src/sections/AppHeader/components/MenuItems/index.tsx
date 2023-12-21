import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Menu } from 'antd'
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Viewer } from '../../../../lib/types'

interface Props {
	viewer: Viewer
}

const { Item, SubMenu } = Menu

export const MenuItems = ({ viewer }: Props) => {
	const subMenuLogin =
		viewer.id && viewer.avatar ? (
			<SubMenu key={viewer.id} title={<Avatar src={viewer.avatar} />}>
				<Item key='/user'>
					<UserOutlined style={{ paddingRight: '5px' }} />
					Profile
				</Item>
				<Item key='/logout'>
					<LogoutOutlined style={{ paddingRight: '5px' }} />
					Log out
				</Item>
			</SubMenu>
		) : (
			<Item>
				<Link to='/login'>
					<Button type='primary'>Sign In</Button>
				</Link>
			</Item>
		)

	return (
		<Menu mode='horizontal' selectable={false} style={MenuStyles}>
			<Item key='/host'>
				<Link to='/host'>
					<HomeOutlined style={{ paddingRight: '5px' }} />
					Host
				</Link>
			</Item>
			{subMenuLogin}
		</Menu>
	)
}
const MenuStyles: React.CSSProperties = {
	width: '100%',
	padding: '0 20px',
	lineHeight: '63px',
	border: 0,
}
