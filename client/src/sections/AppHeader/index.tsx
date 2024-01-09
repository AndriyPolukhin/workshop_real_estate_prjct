import { useState, useEffect } from 'react'
import { Layout, Input } from 'antd'
import {
	Link,
	useLocation,
	useNavigate,
	useNavigation,
	useParams,
} from 'react-router-dom'
import logo from './assets/google_logo.jpg'
import { MenuItems } from './components/MenuItems'
import { Viewer } from '../../lib/types'
import { displayErrorMessage } from '../../lib/utils'

const { Header } = Layout
const { Search } = Input

interface Props {
	viewer: Viewer
	setViewer: (viewer: Viewer) => void
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
	const navigate = useNavigate()
	let { location } = useParams()
	let { pathname } = useLocation()
	const [search, setSearch] = useState('')

	useEffect(() => {
		if (!pathname.includes('/listings')) {
			setSearch('')
			return
		}

		if (pathname.includes('/listings') && location) {
			setSearch(location)
			return
		}
	}, [location])

	const onSearch = (value: string) => {
		const trimmedValue = value.trim()

		if (trimmedValue) {
			navigate(`/listings/${trimmedValue}`)
		} else {
			displayErrorMessage('Please enter a valid search!')
		}
	}
	return (
		<Header className='app-header' style={{ background: 'white' }}>
			<div className='app-header__logo-search-section'>
				<div className='app-header__logo'>
					<Link to='/'>
						<img src={logo} alt='App Logo' style={{ marginTop: '1.5rem' }} />
					</Link>
				</div>
				<div className='app-header__search-input'>
					<Search
						placeholder='Search "San Fransisco"'
						enterButton
						onSearch={onSearch}
						value={search}
						onChange={(evt) => setSearch(evt.target.value)}
					/>
				</div>
			</div>
			<div className='app-header__menu-section'>
				<MenuItems viewer={viewer} setViewer={setViewer} />
			</div>
		</Header>
	)
}
