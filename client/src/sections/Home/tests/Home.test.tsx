/**!TODO:
 * update the current test for v5 of the react-router-dom to work with the v6 of this library
 */
import { createMemoryHistory } from 'history'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { Home } from '../index'
import { Router } from 'react-router-dom'

describe('Home', () => {
	window.scrollTo = () => {}
	describe('search input', () => {
		it('renders an empty search input on initial render', async () => {
			const history = createMemoryHistory()
			const { getByPlaceholderText } = render(
				<MockedProvider mocks={[]}>
					<Router history={history}>
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
		}),
			it('redirects the user to the /listings page when a valid search is provided', async () => {
				const history = createMemoryHistory()
				const { getByPlaceholderText } = render(
					<MockedProvider mocks={[]}>
						<Router history={history}>
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
			}),
			it('does not redirects the user to the /listings page when a invalid search is provided', async () => {
				const history = createMemoryHistory()
				const { getByPlaceholderText } = render(
					<MockedProvider mocks={[]}>
						<Router history={history}>
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
	// describe('premium listings', () => {})
})
