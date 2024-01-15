import dotenv from 'dotenv'
dotenv.config()
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
})

export const Cloudinary = {
	upload: async (image: string) => {
		const res = await cloudinary.uploader.upload(image, {
			folder: 'RE_Assets/',
		})

		return res.secure_url
	},
}