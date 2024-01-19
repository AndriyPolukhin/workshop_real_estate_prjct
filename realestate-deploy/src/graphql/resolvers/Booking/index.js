import { authorize } from '../../../lib/utils';
import { ObjectId } from 'mongodb';
const resolveBookingsIndex = (bookingsIndex, checkInDate, checkOutDate) => {
    let dateCursor = new Date(checkInDate);
    let checkOut = new Date(checkOutDate);
    const newBookingsIndex = {
        ...bookingsIndex,
    };
    while (dateCursor <= checkOut) {
        const y = dateCursor.getUTCFullYear();
        const m = dateCursor.getUTCMonth();
        const d = dateCursor.getUTCDate();
        if (!newBookingsIndex[y]) {
            newBookingsIndex[y] = {};
        }
        if (!newBookingsIndex[y][m]) {
            newBookingsIndex[y][m] = {};
        }
        if (!newBookingsIndex[y][m][d]) {
            newBookingsIndex[y][m][d] = true;
        }
        else {
            throw new Error("selected dates can't overlap dates that already been booked");
        }
        dateCursor = new Date(dateCursor.getTime() + 86400000);
    }
    return newBookingsIndex;
};
export const bookingResolvers = {
    Mutation: {
        createBooking: async (_root, { input }, { db, req }) => {
            try {
                const { id, source, checkIn, checkOut } = input;
                // Verify a logged in user is making the request
                let viewer = await authorize(db, req);
                if (!viewer) {
                    throw new Error('viewer cannot be found');
                }
                // Find listing document that is being booked
                const listing = await db.listings.findOne({ _id: new ObjectId(id) });
                if (!listing) {
                    throw new Error("listing can't be found");
                }
                // Check that the viewer is NOT booking their own listing
                if (listing.host === viewer._id) {
                    throw new Error("viewer can't book own listing");
                }
                // check that checkOut is Not before checkIn
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                if (checkOutDate < checkInDate) {
                    throw new Error("check out date can't be before check in date");
                }
                // create a new bookingIndex for listing being booked
                const bookingsIndex = resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);
                // get total price to charge
                const totalPrice = listing.price *
                    (checkOutDate.getTime() - checkOutDate.getTime() / 86400000 + 1);
                // get user document of host of listing
                const host = await db.users.findOne({ _id: listing.host });
                if (!host || !host.walletId) {
                    throw new Error("the host either can't be found or is not connected with Stripe");
                }
                // create Stripe charge on befalf o host
                // await Stripe.charge(totalPrice, source, host.walletId)
                // await Stripe.payment_intent(totalPrice, host.walletId)
                // insert a new booking document to bookings collection
                const insertResult = await db.bookings.insertOne({
                    _id: new ObjectId(),
                    listing: listing._id,
                    tenant: viewer._id,
                    checkIn,
                    checkOut,
                });
                // update user document of host to increment income
                await db.users.updateOne({ _id: host._id }, { $inc: { income: totalPrice } });
                // update bookings field of tenant
                await db.users.updateOne({ _id: viewer._id }, {
                    $push: {
                        bookings: insertResult.insertedId,
                    },
                });
                // update bookings field of listing document
                await db.listings.updateOne({
                    _id: listing._id,
                }, {
                    $set: { bookingsIndex },
                    $push: { bookings: insertResult.insertedId },
                });
                // Return newly inserted booking
                const insertedBooking = await db.bookings.findOne({
                    _id: insertResult.insertedId,
                });
                return insertedBooking;
            }
            catch (error) {
                throw new Error(`Failed to create booking: ${error}`);
            }
        },
    },
    Booking: {
        id: (booking) => {
            return booking._id.toString();
        },
        listing: async (booking, _args, { db }) => {
            return await db.listings.findOne({ _id: booking.listing });
        },
        tenant: async (booking, _args, { db }) => {
            return await db.users.findOne({ _id: booking.tenant });
        },
    },
};
