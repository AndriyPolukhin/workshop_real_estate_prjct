import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
	Outlet,
} from 'react-router-dom'
import {
	Home,
	Host,
	Listing,
	Listings,
	Login,
	NotFound,
	User,
} from './sections'
import { Viewer } from './lib/types'
import { StyleProvider } from '@ant-design/cssinjs'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { Layout } from 'antd'

const client = new ApolloClient({
	uri: '/api', // "http://localhost:9000/api"
	cache: new InMemoryCache(),
})

const initialViewer: Viewer = {
	id: null,
	token: null,
	avatar: null,
	hasWallet: null,
	didRequest: false,
}

const App = () => {
	const [viewer, setViewer] = useState(initialViewer)

	return (
		<Layout
			id='app'
			style={{
				position: 'relative',
				background: '#fff',
				minHeight: '100vh',
			}}
		>
			<Outlet></Outlet>
		</Layout>
	)
}

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />}>
			<Route index={true} path='/' element={<Home />} />
			<Route path='/host' element={<Host />} />

			<Route path='/listing/:id' element={<Listing />} />
			<Route path='/listings/:location?' element={<Listings />} />
			<Route path='/login' element={<Login />} />
			<Route path='/user/:id' element={<User />} />
			<Route path='*' element={<NotFound />} />
		</Route>
	)
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<StyleProvider hashPriority='high'>
				<RouterProvider router={router} />
			</StyleProvider>
		</ApolloProvider>
	</React.StrictMode>
)
