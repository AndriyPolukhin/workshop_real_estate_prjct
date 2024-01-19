import dotenv from 'dotenv'
dotenv.config()
import stripe from 'stripe'

const client = new stripe(`${process.env.S_SECRET_KEY}`)

export const Stripe = {
	connect: async (code: string) => {
		const response = await client.oauth.token({
			grant_type: 'authorization_code',
			code,
		})

		return response
	},
	disconnect: async (stripeUserId: string) => {
		const response = await client.oauth.deauthorize({
			client_id: `${process.env.S_CLIENT_ID}`,
			stripe_user_id: stripeUserId,
		})

		return response
	},
	charge: async (amount: number, source: string, stripeAccount: string) => {
		const res = await client.charges.create(
			{
				amount,
				currency: 'usd',
				source,
				application_fee_amount: Math.round(amount * 0.05),
			},
			{
				stripeAccount,
			}
		)

		if (res.status !== 'succeeded') {
			throw new Error('failed to create charge with Stripe')
		}
	},
	payment_intent: async (amount: number, stripeAccount: string) => {
		const paymentIntent = await client.paymentIntents.create(
			{
				amount,
				currency: 'usd',
				automatic_payment_methods: {
					enabled: true,
				},
				application_fee_amount: Math.round(amount * 0.05),
			},
			{
				stripeAccount,
			}
		)
		if (paymentIntent.status !== 'succeeded') {
			throw new Error('failed to create charge with Stripe')
		}
	},
}
