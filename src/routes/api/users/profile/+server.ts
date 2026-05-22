import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { signToken } from '$lib/server/auth';

// PATCH /api/users/profile — update profile fields and re-issue JWT
export async function PATCH({ request, locals, cookies }) {
	if (!locals.user) throw error(401, 'Unauthorized');
	try {
		await connectDB();
		const updates = await request.json();

		// Allowed fields only
		const allowed = ['skillLevel', 'machineType', 'goals', 'onboardingCompleted', 'isPublicOnLeaderboard'];
		const patch: Record<string, unknown> = {};
		for (const key of allowed) {
			if (key in updates) patch[key] = updates[key];
		}

		const user = await User.findByIdAndUpdate(locals.user.id, patch, { new: true });
		if (!user) throw error(404, 'User not found');

		// Re-issue JWT with updated fields
		const session = {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			role: user.role as 'admin' | 'user',
			skillLevel: user.skillLevel as 'beginner' | 'home_barista' | 'expert',
			machineType: user.machineType,
			onboardingCompleted: user.onboardingCompleted,
			xp: user.xp ?? 0,
			level: user.level ?? 'novice'
		};
		const token = signToken(session);
		cookies.set('session', token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });

		return json({ user: session });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('PATCH /api/users/profile error:', err);
		throw error(500, 'Update failed');
	}
}

// GET /api/users/profile — full user data including XP/badges
export async function GET({ locals }) {
	if (!locals.user) throw error(401, 'Unauthorized');
	try {
		await connectDB();
		const user = await User.findById(locals.user.id);
		if (!user) throw error(404, 'User not found');
		return json(user.toJSON());
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		throw error(500, 'Failed to fetch profile');
	}
}
