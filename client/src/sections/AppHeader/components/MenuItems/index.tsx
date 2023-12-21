import React from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Avatar, Button, Menu } from 'antd'
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { LOG_OUT } from '../../../../lib/graphql/mutations'
import { LogOutMutation as LogOutData } from '../../../../lib/graphql/__generated__/graphql'
import {
	displayErrorMessage,
	displaySuccessNotification,
} from '../../../../lib/utils'
import { Viewer } from '../../../../lib/types'
import type { MenuProps } from 'antd'
interface Props {
	viewer: Viewer
	setViewer: (viewer: Viewer) => void
}

const { Item, SubMenu } = Menu

const MenuStyles: React.CSSProperties = {
	width: '100%',
	padding: '0 20px',
	lineHeight: '63px',
	border: 0,
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
	const [logOut] = useMutation<LogOutData>(LOG_OUT, {
		onCompleted: (data) => {
			if (data && data.logOut) {
				setViewer({
					id: data.logOut.id || null,
					token: data.logOut.token || null,
					avatar: data.logOut.avatar || null,
					hasWallet: data.logOut.hasWallet || false,
					didRequest: data.logOut.didRequest || true,
				})
				displaySuccessNotification("You've successfully logged out!")
			}
		},
		onError: (data) => {
			displayErrorMessage(
				"Sorry! We weren't able to log you out. Please try again later!"
			)
		},
	})

	const handleLogOut = () => {
		logOut()
	}

	const items: MenuProps['items'] = [
		{
			label: <Link to='/host'>Host</Link>,
			key: '/host',
			icon: <HomeOutlined style={{ paddingRight: '5px' }} />,
		},
		{
			label: (
				<Link to='/login'>
					<Button type='primary'>Sign In</Button>
				</Link>
			),
			key: '/login',
		},
	]

	const items2: MenuProps['items'] = [
		{
			label: <Link to='/host'>Host</Link>,
			key: '/host',
			icon: <HomeOutlined style={{ paddingRight: '5px' }} />,
		},
		{
			label: <Avatar src={viewer.avatar} />,
			key: 'avatar',
			children: [
				{
					label: <Link to='/user'>Profile</Link>,
					key: '/user',
					icon: <UserOutlined style={{ paddingRight: '5px' }} />,
				},
				{
					label: (
						<span onClick={handleLogOut} style={{ textDecoration: 'none' }}>
							Log out
						</span>
					),
					key: '/logout',
					icon: <LogoutOutlined />,
				},
			],
		},
	]

	return (
		<Menu
			style={MenuStyles}
			mode='horizontal'
			selectable={false}
			items={viewer.id && viewer.avatar ? items2 : items}
		/>
	)
}

export const MenuItemsBackup = ({ viewer, setViewer }: Props) => {
	const [logOut] = useMutation<LogOutData>(LOG_OUT, {
		onCompleted: (data) => {
			if (data && data.logOut) {
				setViewer({
					id: data.logOut.id || null,
					token: data.logOut.token || null,
					avatar: data.logOut.avatar || null,
					hasWallet: data.logOut.hasWallet || false,
					didRequest: data.logOut.didRequest || true,
				})
				displaySuccessNotification("You've successfully logged out!")
			}
		},
		onError: (data) => {
			displayErrorMessage(
				"Sorry! We weren't able to log you out. Please try again later!"
			)
		},
	})

	const handleLogOut = () => {
		logOut()
	}
	const subMenuLogin =
		viewer.id && viewer.avatar ? (
			<SubMenu key={viewer.id} title={<Avatar src={viewer.avatar} />}>
				<Item key='/user'>
					<Link to='/user'>
						<UserOutlined style={{ paddingRight: '5px' }} />
						Profile
					</Link>
				</Item>
				<Item key='/logout'>
					<div onClick={handleLogOut}>
						<LogoutOutlined style={{ paddingRight: '5px' }} />
						Log out
					</div>
				</Item>
			</SubMenu>
		) : (
			<Item key='/login'>
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
