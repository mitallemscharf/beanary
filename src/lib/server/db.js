import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';

let cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  const uri = env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set — add it to .env');

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
