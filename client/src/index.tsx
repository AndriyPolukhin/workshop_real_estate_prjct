import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import {
	App,
	Home,
	Host,
	Listing,
	Listings,
	Login,
	NotFound,
	User,
	Stripe,
} from './sections'
import { StyleProvider } from '@ant-design/cssinjs'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import './styles/index.css'

const client = new ApolloClient({
	uri: '/api', // "http://localhost:9000/api"
	cache: new InMemoryCache(),
	headers: {
		'X-CSRF-TOKEN': sessionStorage.getItem('token') || '',
	},
})

const stripePromise = loadStripe(`${process.env.REACT_APP_S_PUBLISHABLE_KEY}`)

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />}>
			<Route index={true} path='/' element={<Home />} />
			<Route path='/host' element={<Host />} />

			<Route path='/listing/:id' element={<Listing />} />
			<Route path='/listings/:location?' element={<Listings />} />
			<Route path='/login' element={<Login />} />
			<Route path='/stripe' element={<Stripe />} />
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
				<Elements stripe={stripePromise}>
					<RouterProvider router={router} />
				</Elements>
			</StyleProvider>
		</ApolloProvider>
	</React.StrictMode>
)
