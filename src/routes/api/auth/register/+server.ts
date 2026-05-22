import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { signToken } from '$lib/server/auth';
import { computeLevel } from '$lib/server/gamification';

export async function POST({ request, cookies }) {
	try {
		await connectDB();
		const { name, email, password, skillLevel, machineType, goals } = await request.json();

		if (!name || !email || !password) throw error(400, 'Name, email, and password are required');
		if (password.length < 6) throw error(400, 'Password must be at least 6 characters');

		const existing = await User.findOne({ email: email.toLowerCase().trim() });
		if (existing) throw error(409, 'An account with this email already exists');

		const user = new User({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password,
			role: 'user',
			skillLevel: skillLevel || 'home_barista',
			machineType: machineType || 'espresso_semi',
			goals: goals || [],
			xp: 0,
			level: 'novice',
			onboardingCompleted: skillLevel !== 'beginner'
		});
		await user.save();

		const session = {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			role: user.role as 'admin' | 'user',
			skillLevel: user.skillLevel as 'beginner' | 'home_barista' | 'expert',
			machineType: user.machineType,
			onboardingCompleted: user.onboardingCompleted,
			xp: 0,
			level: 'novice'
		};
		const token = signToken(session);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7
		});

		return json({ user: session }, { status: 201 });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('POST /api/auth/register error:', err);
		throw error(500, 'Registration failed');
	}
}
