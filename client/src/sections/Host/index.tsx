import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
	Layout,
	Input,
	InputNumber,
	Typography,
	Form,
	Button,
	Radio,
	Upload,
} from 'antd'
import {
	BankOutlined,
	HomeOutlined,
	PlusOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import { useViewer } from '../index'
import { Viewer } from '../../lib/types'
import { HOST_LISTING } from '../../lib/graphql/mutations'
import {
	ListingType,
	HostListingMutation as HostListingData,
	HostListingMutationVariables,
} from '../../lib/graphql/__generated__/graphql'
import {
	iconColor,
	displayErrorMessage,
	displaySuccessNotification,
} from '../../lib/utils'
import { useScrollToTop } from '../../lib/hooks'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
const { Content } = Layout
const { Text, Title } = Typography
const { Item } = Form

interface Props {
	viewer: Viewer
}
export const Host = () => {
	useScrollToTop()
	const navigate = useNavigate()
	const [imageLoading, setImageLoading] = useState(false)
	const [imageBase64Value, setImageBase64Value] = useState<string | null>(null)
	const handleImageUpload = (info: UploadChangeParam<UploadFile>) => {
		const { file } = info

		if (file.status === 'uploading') {
			setImageLoading(true)
			return
		}

		if (file.status === 'done' && file.originFileObj) {
			getBase64Value(file.originFileObj as RcFile, (imageBase64Value) => {
				setImageBase64Value(imageBase64Value)
				setImageLoading(false)
			})
		}
	}

	const redirectToHostListingPage = (id: string | null | undefined) => {
		if (id) {
			return navigate(`/listing/${id}`)
		} else {
			console.error('listing id is not present')
		}
	}

	const [hostListing, { data, loading }] = useMutation<
		HostListingData,
		HostListingMutationVariables
	>(HOST_LISTING, {
		onCompleted: () => {
			displaySuccessNotification("You've successfully created your listing")
		},
		onError: () => {
			displayErrorMessage(
				"Sorry! We weren't able to create your listing. Please try again later!"
			)
		},
	})

	const handleHostListing = (values: any) => {
		const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`
		const input = {
			...values,
			address: fullAddress,
			image: imageBase64Value,
			price: values.price * 100,
		}
		delete input.city
		delete input.state
		delete input.postalCode

		hostListing({
			variables: {
				input,
			},
		})
	}

	const handleHostListingFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
		if (errorInfo) {
			displayErrorMessage('Please complete all required form fields!')
			return
		}
	}

	const { viewer }: Props = useViewer()

	if (!viewer.id || !viewer.hasWallet) {
		return (
			<Content className='host-content'>
				<div className='host__form-header'>
					<Title level={4} className='host__form-title'>
						You'll have to be signed in and connected with Stripe to host a
						listing!
					</Title>
					<Text type='secondary'>
						We only allow users who've signed to our application and have
						connected with Stripe to host new listings. You can sign in at the{' '}
						<Link to='/login'>/login</Link> page
					</Text>
				</div>
			</Content>
		)
	}

	if (loading) {
		return (
			<Content className='host-content'>
				<div className='host__form-header'>
					<Title level={3} className='host__form-title'>
						Please wait!
					</Title>
					<Text type='secondary'>We're creating your listing now</Text>
				</div>
			</Content>
		)
	}

	if (data && data.hostListing) {
		redirectToHostListingPage(data.hostListing.id)
	}

	return (
		<Content className='host-content'>
			<Form
				layout='vertical'
				initialValues={{ remember: true }}
				onFinish={handleHostListing}
				onFinishFailed={handleHostListingFailed}
			>
				<div className='host__form-header'>
					<Title level={3} className='host__form-title'>
						Hi! Let's get started listing your place.
					</Title>
					<Text type='secondary'>
						In this form, we'll collect some basic and additional information
						about your listing.
					</Text>
				</div>

				<Item
					label='Home Type'
					name='type'
					rules={[{ required: true, message: 'Please select a Home Type' }]}
				>
					<Radio.Group>
						<Radio.Button value={ListingType.Appartment}>
							<BankOutlined style={{ color: iconColor, paddingRight: '5px' }} />
							<span>Appartment</span>
						</Radio.Button>
						<Radio.Button value={ListingType.House}>
							<HomeOutlined style={{ color: iconColor, paddingRight: '5px' }} />
							<span>House</span>
						</Radio.Button>
					</Radio.Group>
				</Item>
				<Item
					label='Title'
					name='title'
					extra='Max character count of 45'
					rules={[
						{
							required: true,
							message: 'Please provide a title for your listing',
						},
					]}
				>
					<Input
						maxLength={45}
						placeholder='The iconic and luxurios Bel-Air mansion'
					/>
				</Item>
				<Item
					label='Description of listing'
					name='description'
					extra='Max character count of 400'
					rules={[
						{
							required: true,
							message: 'Please enter a description for your listing',
						},
					]}
				>
					<Input.TextArea
						rows={3}
						maxLength={400}
						placeholder='Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bal-Air Los Angeles.'
					/>
				</Item>
				<Item
					label='Address'
					name='address'
					rules={[
						{
							required: true,
							message: 'Please enter address for your listing',
						},
					]}
				>
					<Input placeholder='251 North Bristol Avenue' />
				</Item>
				<Item
					label='City/Town'
					name='city'
					rules={[
						{
							required: true,
							message: 'Please enter a city (or region) for your listing',
						},
					]}
				>
					<Input placeholder='Los Angeles' />
				</Item>
				<Item
					label='State/Province'
					name='state'
					rules={[
						{
							required: true,
							message: 'Please enter state (or province) for your listing',
						},
					]}
				>
					<Input placeholder='California' />
				</Item>
				<Item
					label='Zip/Postal Code'
					name='postalCode'
					rules={[
						{
							required: true,
							message: 'Please enter zip (or postal) code for your listing',
						},
					]}
				>
					<Input placeholder='Please enter a zip code for your listing' />
				</Item>

				<Item
					name='image'
					label='Image'
					extra='Images have to be under 1MB in size and of type JPG or PNG'
					rules={[
						{
							required: true,
							message: 'Please provide an image for your listing',
						},
					]}
				>
					<Upload
						className='host__form-image-upload'
						listType='picture-card'
						showUploadList={false}
						action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
						beforeUpload={beforeImageUpload}
						onChange={handleImageUpload}
					>
						{imageBase64Value ? (
							<img src={imageBase64Value} alt='Listing' />
						) : (
							<div>
								{imageLoading ? <UploadOutlined /> : <PlusOutlined />}
								<div className='ant-upload-text'>Upload</div>
							</div>
						)}
					</Upload>
				</Item>

				<Item
					label='Price'
					name='price'
					extra='All prices in $USD/day'
					rules={[
						{
							required: true,
							message: 'Please enter a price $usd/day for your listing',
						},
					]}
				>
					<InputNumber min={0} placeholder='120' />
				</Item>
				<Item
					label='Max # of guests'
					name='numOfGuests'
					rules={[
						{ required: true, message: 'Please enter a max number of guests' },
					]}
				>
					<InputNumber min={1} placeholder='4' />
				</Item>
				<Item>
					<Button type='primary' htmlType='submit'>
						Submit
					</Button>
				</Item>
			</Form>
		</Content>
	)
}

const beforeImageUpload = (file: RcFile) => {
	const fileIsValidImage =
		file.type === 'image/jpeg' || file.type === 'image/png'
	const fileIsValidSize = file.size / 1024 / 1024 < 1

	if (!fileIsValidImage) {
		displayErrorMessage('You can only upload valid JPG/PNG file!')
		return false
	}
	if (!fileIsValidSize) {
		displayErrorMessage(
			'You can only uplaod valid image files of under 1 MB in size!'
		)
		return false
	}

	return fileIsValidImage && fileIsValidSize
}

const getBase64Value = (
	img: RcFile | Blob,
	callback: (imageBase64Value: string) => void
) => {
	const reader = new FileReader()
	reader.addEventListener('load', () => callback(reader.result as string))
	reader.readAsDataURL(img)
}
