import { Router, Route, useLocation } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { AUTH_URL } from '../../../lib/graphql/queries'
import { Login } from '../index'
import { GraphQLError } from 'graphql'

describe('Login', () => {
	window.scrollTo = () => {}

	describe('AUTH_URL Query', () => {
		it('redirects the user when query was successful', async () => {
			window.location.assign = jest.fn()
			const authUrlMock = {
				request: {
					query: AUTH_URL,
				},
				result: {
					data: {
						authUrl: 'https://google.com/signin',
					},
				},
			}
			const history = createMemoryHistory({
				initialEntries: ['/login'],
			})

			const location = useLocation()

			const { getByRole, queryByText } = render(
				<MockedProvider mocks={[authUrlMock]} addTypename={false}>
					<Router location={location} navigator={history}>
						<Route path='/login' element={<Login />} />
					</Router>
				</MockedProvider>
			)

			const authUrlButton = getByRole('button')
			fireEvent.click(authUrlButton)

			await waitFor(() => {
				expect(window.location.assign).toHaveBeenCalledWith(
					'https://google.com/signin'
				)
				expect(
					queryByText(
						"Sorry! We weren't able to log you in. Please try again later!"
					)
				).toBeNull()
			})
		})
		it('does not redirects the user when query when query is unsuccessful', async () => {
			window.location.assign = jest.fn()
			const authUrlMock = {
				request: {
					query: AUTH_URL,
				},
				errors: [new GraphQLError('Something went wrong')],
			}
			const history = createMemoryHistory({
				initialEntries: ['/login'],
			})

			const location = useLocation()

			const { getByRole, queryByText } = render(
				<MockedProvider mocks={[authUrlMock]} addTypename={false}>
					<Router location={location} navigator={history}>
						<Route path='/login' element={<Login />} />
					</Router>
				</MockedProvider>
			)

			const authUrlButton = getByRole('button')
			fireEvent.click(authUrlButton)

			await waitFor(() => {
				expect(window.location.assign).not.toHaveBeenCalledWith(
					'https://google.com/signin'
				)
				expect(
					queryByText(
						"Sorry! We weren't able to log you in. Please try again later!"
					)
				).not.toBeNull()
			})
		})
	})
	describe('LOGIN Mutation', () => {})
})
