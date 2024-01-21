import { render, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { Home } from '../index'

describe('Home', () => {
	window.scrollTo = () => {}
	describe('search input', () => {
		it('renders an empty search input on initial render', async () => {
			const { getByPlaceholderText } = render(
				<MockedProvider mocks={[]}>
					<Home />
				</MockedProvider>
			)

			await waitFor(() => {
				const searchInput = getByPlaceholderText(
					"Search 'San Fransisso'"
				) as HTMLInputElement

				expect(searchInput.value).toEqual('')
			})
		})
	})
	// describe("premium listings", () => {})
})
