import React from 'react'
import ReactDOM from 'react-dom/client'

import { Listings } from './sections'
import { StyleProvider } from '@ant-design/cssinjs'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
// import './styles/index.css'

import reportWebVitals from './reportWebVitals'

const client = new ApolloClient({
	uri: '/api', // "http://localhost:9000"
	cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<StyleProvider hashPriority='high'>
				<Listings title='Real Estate Project' />
			</StyleProvider>
		</ApolloProvider>
	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
