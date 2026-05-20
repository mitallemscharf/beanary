import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { signToken, cookieOptions } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	try {
		await connectDB();
		const { email, password } = await request.json();

		if (!email || !password) throw error(400, 'Email and password are required');

		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) throw error(401, 'Invalid email or password');

		const valid = await user.comparePassword(password);
		if (!valid) throw error(401, 'Invalid email or password');

		const session = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
		const token = signToken(session);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7
		});

		return json({ user: session });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('POST /api/auth/login error:', err);
		throw error(500, 'Login failed');
	}
}
