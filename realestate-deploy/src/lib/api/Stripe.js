import dotenv from 'dotenv';
dotenv.config();
import stripe from 'stripe';
const client = new stripe(`${process.env.S_SECRET_KEY}`);
export const Stripe = {
    connect: async (code) => {
        const response = await client.oauth.token({
            grant_type: 'authorization_code',
            code,
        });
        return response;
    },
    charge: async (amount, source, stripeAccount) => {
        const res = await client.charges.create({
            amount,
            currency: 'usd',
            source,
            application_fee_amount: Math.round(amount * 0.05),
        }, {
            stripeAccount,
        });
        if (res.status !== 'succeeded') {
            throw new Error('failed to create charge with Stripe');
        }
    },
    payment_intent: async (amount, stripeAccount) => {
        const paymentIntent = await client.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            application_fee_amount: Math.round(amount * 0.05),
        }, {
            stripeAccount,
        });
        if (paymentIntent.status !== 'succeeded') {
            throw new Error('failed to create charge with Stripe');
        }
    },
};
