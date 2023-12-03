import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
	mongoose.set('strictQuery', true);

	if (!process.env.MONGODB_URL) {
		return console.log('Missing MONGODB_URL');
	}

	if (isConnected) {
		return console.log('Database is already connected!');
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			dbName: 'devflow',
		});
		isConnected = true;
		console.log('MongoDB is connected');
	} catch (e) {
		console.log('MongoDB error ' + e);
	}
};
