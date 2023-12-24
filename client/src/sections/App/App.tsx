import React, { useState, useEffect } from 'react'
import { Viewer } from '../../lib/types'
import { Outlet, useOutletContext } from 'react-router-dom'
import { Layout, Affix } from 'antd'
import { AppHeader } from '../../sections'

const initialViewer: Viewer = {
	id: null,
	token: null,
	avatar: null,
	hasWallet: null,
	didRequest: false,
}
interface ViewerType {
	setViewer: (viewer: Viewer) => void
}
export const App = () => {
	const [viewer, setViewer] = useState<Viewer>(initialViewer)

	return (
		<Layout
			id='app'
			style={{
				position: 'relative',
				background: '#fff',
				minHeight: '100vh',
			}}
		>
			<Affix
				offsetTop={0}
				style={{
					zIndex: 99,
				}}
			>
				<AppHeader viewer={viewer} setViewer={setViewer} />
			</Affix>
			<Outlet context={{ setViewer }} />
		</Layout>
	)
}

export const useViewer = () => {
	return useOutletContext<ViewerType>()
}
