import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
	if (mongoose.connection.readyState === 1) return;

	const uri = env.MONGODB_URI;
	if (!uri) throw new Error('MONGODB_URI environment variable is not set');

	if (!connectionPromise) {
		connectionPromise = mongoose.connect(uri, {
			serverSelectionTimeoutMS: 5000
		});
	}

	await connectionPromise;
}
