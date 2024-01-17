import { useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { CONNECT_STRIPE } from '../../lib/graphql/mutations'
import {
	ConnectStripeMutation as ConnectStripeData,
	ConnectStripeMutationVariables,
} from '../../lib/graphql/__generated__/graphql'
import { useViewer } from '../index'
import { displaySuccessNotification } from '../../lib/utils'
import { Viewer } from '../../lib/types'
const { Content } = Layout

interface Props {
	viewer: Viewer
	setViewer: (viewer: Viewer) => void
}

export const Stripe = () => {
	const { viewer, setViewer }: Props = useViewer()
	const navigate = useNavigate()
	const redirectToUserPage = (
		id: string | null | undefined,
		errorHappened: boolean
	) => {
		if (id && errorHappened) {
			return navigate(`/user/${id}?stripe_error=${errorHappened}`)
		} else if (id && !errorHappened) {
			return navigate(`/user/${id}`)
		} else {
			console.error('user data is not present')
		}
	}
	const [connectStripe, { data, loading, error }] = useMutation<
		ConnectStripeData,
		ConnectStripeMutationVariables
	>(CONNECT_STRIPE, {
		onCompleted: (data) => {
			if (data && data.connectStripe) {
				displaySuccessNotification(
					"You've successfully connected your Stripe Account!",
					'You can now begin to create listings in the Host page.'
				)
			}
		},
	})

	const connectStripeRef = useRef(connectStripe)
	useEffect(() => {
		const code = new URL(window.location.href).searchParams.get('code')

		if (code) {
			connectStripeRef.current({
				variables: {
					input: { code },
				},
			})
		} else {
			return navigate('/login')
		}
	}, [navigate, viewer])

	if (data && data.connectStripe) {
		setViewer({
			...viewer,
			hasWallet: data.connectStripe.hasWallet || false,
		})
		redirectToUserPage(viewer.id, false)
	}

	if (loading) {
		return (
			<Content className='stripe'>
				<Spin size='large' />
			</Content>
		)
	}

	if (error) {
		let errorHappened = error ? true : false
		redirectToUserPage(viewer.id, errorHappened)
	}

	return null
}
