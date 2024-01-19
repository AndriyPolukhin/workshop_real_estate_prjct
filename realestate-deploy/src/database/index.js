import { MongoClient } from 'mongodb';
const connectDatabase = async () => {
    try {
        const client = await MongoClient.connect(`${process.env.MONGO_URI}`);
        const db = client.db('main');
        console.log(`		💽  MongoDB Connected to db: ${db.namespace}`);
        return {
            bookings: db.collection('bookings'),
            listings: db.collection('listings'),
            users: db.collection('users'),
        };
    }
    catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
};
export default connectDatabase;
