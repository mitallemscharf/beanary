import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import crypto from 'crypto';

export async function POST({ request }) {
	const { email } = await request.json().catch(() => ({}));
	if (!email) throw error(400, 'Email required');

	await connectDB();
	const user = await User.findOne({ email: String(email).toLowerCase().trim() });

	// Always respond the same way to prevent email enumeration
	if (!user) return json({ ok: true });

	const token = crypto.randomBytes(32).toString('hex');
	const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	await User.findByIdAndUpdate(user._id, { resetToken: token, resetExpiry: expiry });

	// In production this token would be emailed; returned here for the demo environment
	return json({ ok: true, resetToken: token });
}
