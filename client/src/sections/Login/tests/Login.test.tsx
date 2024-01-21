import { Router, Route, useLocation } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { AUTH_URL } from '../../../lib/graphql/queries'
import { LOG_IN } from '../../../lib/graphql/mutations'
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
	describe('LOGIN Mutation', () => {
		it('when no code exits in the /login route the mutation do not fired', async () => {
			const logInMock = {
				request: {
					query: LOG_IN,
					variables: {
						input: {
							code: '1234',
						},
					},
				},
				result: {
					data: {
						logIn: {
							id: '111',
							token: '4321',
							avatar: 'image.png',
							hasWallet: false,
							didRequest: true,
						},
					},
				},
			}

			const history = createMemoryHistory({
				initialEntries: ['/login'],
			})

			render(
				<MockedProvider mocks={[logInMock]} addTypename={false}>
					<Router location={location} navigator={history}>
						<Route path='/login' element={<Login />} />
					</Router>
				</MockedProvider>
			)

			await waitFor(() => {
				expect(history.location.pathname).not.toBe('/user/111')
			})
		})
		describe('code exist in the /login route as a query paramter', () => {
			it('displays a loading indicator when the mutation is in progress', async () => {
				const history = createMemoryHistory({
					initialEntries: ['/login?code=1234'],
				})

				const { queryByText } = render(
					<MockedProvider mocks={[]} addTypename={false}>
						<Router location={location} navigator={history}>
							<Route path='/login' element={<Login />} />
						</Router>
					</MockedProvider>
				)

				await waitFor(() => {
					expect(queryByText('Loggin you in...')).not.toBeNull()
				})
			})
			it('redirects the user to the user page when the mutation is successful', async () => {
				const logInMock = {
					request: {
						query: LOG_IN,
						variables: {
							input: {
								code: '1234',
							},
						},
					},
					result: {
						data: {
							logIn: {
								id: '111',
								token: '4321',
								avatar: 'image.png',
								hasWallet: false,
								didRequest: true,
							},
						},
					},
				}

				const history = createMemoryHistory({
					initialEntries: ['/login?code=1234'],
				})

				render(
					<MockedProvider mocks={[logInMock]} addTypename={false}>
						<Router location={location} navigator={history}>
							<Route path='/login' element={<Login />} />
						</Router>
					</MockedProvider>
				)

				await waitFor(() => {
					expect(history.location.pathname).toBe('/user/111')
				})
			})
			it('does not redirect the user to their user page and displays an error message when mutation is unsuccessful', async () => {
				const logInMock = {
					request: {
						query: LOG_IN,
						variables: {
							input: {
								code: '1234',
							},
						},
					},
					errors: [new GraphQLError('Something went wrong')],
				}

				const history = createMemoryHistory({
					initialEntries: ['/login?code=1234'],
				})

				const { queryByText } = render(
					<MockedProvider mocks={[logInMock]} addTypename={false}>
						<Router location={location} navigator={history}>
							<Route path='/login' element={<Login />} />
						</Router>
					</MockedProvider>
				)

				await waitFor(() => {
					expect(history.location.pathname).not.toBe('/user/111')
					expect(
						queryByText(
							"Sorry! We weren't able to log you in. Please try again later!"
						)
					).not.toBeNull()
				})
			})
		})
	})
})
