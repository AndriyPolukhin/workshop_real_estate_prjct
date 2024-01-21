/**!TODO:
 * update the current test for v5 of the react-router-dom to work with the v6 of this library
 */
import { createMemoryHistory } from 'history'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { Home } from '../index'
import { Router, useLocation } from 'react-router-dom'

import { LISTINGS } from '../../../lib/graphql/queries'
import {
	ListingsQuery as ListingsData,
	Listings as ListingsType,
	ListingsQueryVariables,
	ListingsFilter,
} from '../../../lib/graphql/__generated__/graphql'

describe('Home', () => {
	window.scrollTo = () => {}

	describe('search input', () => {
		it('renders an empty search input on initial render', async () => {
			const history = createMemoryHistory()
			const location = useLocation()
			const { getByPlaceholderText } = render(
				<MockedProvider mocks={[]}>
					<Router location={location} navigator={history}>
						<Home />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				const searchInput = getByPlaceholderText(
					"Search 'San Fransisso'"
				) as HTMLInputElement

				expect(searchInput.value).toEqual('')
			})
		})
		it('redirects the user to the /listings page when a valid search is provided', async () => {
			const history = createMemoryHistory()
			const location = useLocation()
			const { getByPlaceholderText } = render(
				<MockedProvider mocks={[]}>
					<Router location={location} navigator={history}>
						<Home />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				const searchInput = getByPlaceholderText(
					"Search 'San Fransisso'"
				) as HTMLInputElement

				// change the value of the input
				fireEvent.change(searchInput, { target: { value: 'Toronto' } })
				// presing the enter key
				fireEvent.keyDown(searchInput, {
					key: 'Enter',
					keyCode: 13,
				})

				expect(history.location.pathname).toBe('/listings/Toronto')
			})
		})
		it('does not redirects the user to the /listings page when a invalid search is provided', async () => {
			const history = createMemoryHistory()
			const location = useLocation()
			const { getByPlaceholderText } = render(
				<MockedProvider mocks={[]}>
					<Router location={location} navigator={history}>
						<Home />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				const searchInput = getByPlaceholderText(
					"Search 'San Fransisso'"
				) as HTMLInputElement

				// change the value of the input
				fireEvent.change(searchInput, {
					target: { value: '' },
				})
				// presing the enter key
				fireEvent.keyDown(searchInput, {
					key: 'Enter',
					keyCode: 13,
				})

				expect(history.location.pathname).toBe('/')
			})
		})
	})

	describe('premium listings', () => {
		it('renders the loading state when the query is loading', async () => {
			const history = createMemoryHistory()
			const location = useLocation()
			const { queryByText } = render(
				<MockedProvider mocks={[]}>
					<Router location={location} navigator={history}>
						<Home />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				expect(queryByText('Premium Listings - Loading')).not.toBeNull()
				expect(queryByText('Premium Listings')).toBeNull()
			})
		})
		it('renders the intented UI when the query is successful', async () => {
			const listingsMock = {
				request: {
					query: LISTINGS,
					variables: {
						filter: ListingsFilter.PriceHighToLow,
						limit: 4,
						page: 1,
					},
				},
				result: {
					data: {
						listings: {
							region: null,
							total: 10,
							result: [
								{
									id: '1234',
									title: 'Bev Hills',
									image: 'image.png',
									addres: '90210 Stree in LA',
									price: 9000,
									numOfGuests: 2,
								},
							],
						},
					},
				},
			}

			const history = createMemoryHistory()
			const location = useLocation()
			const { queryByText } = render(
				<MockedProvider mocks={[listingsMock]} addTypename={false}>
					<Router location={location} navigator={history}>
						<Home />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				expect(queryByText('Premium Listings')).not.toBeNull()
				expect(queryByText('Premium Listings - Loading')).toBeNull()
			})
		})
		it('does not render the loading section or the listings section when query has an error', async () => {
			const listingsMock = {
				request: {
					query: LISTINGS,
					variables: {
						filter: ListingsFilter.PriceHighToLow,
						limit: 4,
						page: 1,
					},
				},
				error: new Error('Network Error'),
			}

			const history = createMemoryHistory()
			const location = useLocation()
			const { queryByText } = render(
				<MockedProvider mocks={[listingsMock]} addTypename={false}>
					<Router location={location} navigator={history}>
						<Home />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				expect(queryByText('Premium Listings')).toBeNull()
				expect(queryByText('Premium Listings - Loading')).toBeNull()
			})
		})
	})
})
