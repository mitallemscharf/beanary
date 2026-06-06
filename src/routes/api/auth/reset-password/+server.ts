import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';

export async function POST({ request }) {
	const { token, newPassword } = await request.json().catch(() => ({}));

	if (!token || !newPassword) throw error(400, 'Missing required fields');
	if (newPassword.length < 6) return json({ ok: false, message: 'Password must be at least 6 characters.' }, { status: 400 });

	await connectDB();
	const user = await User.findOne({ resetToken: token, resetExpiry: { $gt: new Date() } });

	if (!user) return json({ ok: false, message: 'This reset link is invalid or has expired.' }, { status: 400 });

	user.password = newPassword; // pre-save hook hashes it
	user.resetToken = undefined;
	user.resetExpiry = undefined;
	await user.save();

	return json({ ok: true });
}
