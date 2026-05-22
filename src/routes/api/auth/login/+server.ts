import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { signToken } from '$lib/server/auth';
import { awardXP, XP } from '$lib/server/gamification';

export async function POST({ request, cookies }) {
	try {
		await connectDB();
		const { email, password } = await request.json();

		if (!email || !password) throw error(400, 'Email and password are required');

		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) throw error(401, 'Invalid email or password');

		const valid = await user.comparePassword(password);
		if (!valid) throw error(401, 'Invalid email or password');

		// Daily login XP
		const today = new Date().toDateString();
		if (user.lastLoginDate !== today) {
			user.lastLoginDate = today;
			await user.save();
			await awardXP(user._id.toString(), XP.DAILY_LOGIN);
			// Re-fetch to get updated XP/level
			const updated = await User.findById(user._id);
			if (updated) {
				user.xp = updated.xp;
				user.level = updated.level;
			}
		}

		const session = {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			role: user.role as 'admin' | 'user',
			skillLevel: (user.skillLevel ?? 'home_barista') as 'beginner' | 'home_barista' | 'expert',
			machineType: user.machineType ?? 'espresso_semi',
			onboardingCompleted: user.onboardingCompleted ?? false,
			xp: user.xp ?? 0,
			level: user.level ?? 'novice'
		};
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
