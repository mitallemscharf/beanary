import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { Shot } from '$lib/server/models/Shot';

export async function GET({ url, locals }) {
	if (!locals.user) throw error(401, 'Unauthorized');
	try {
		await connectDB();

		// Fetch all public users sorted by XP
		const users = await User.find({ isPublicOnLeaderboard: { $ne: false } })
			.select('name xp level badges skillLevel machineType createdAt')
			.sort({ xp: -1 })
			.limit(50);

		const leaderboard = users.map((u, i) => ({
			rank: i + 1,
			id: u._id.toString(),
			name: u.name,
			xp: u.xp ?? 0,
			level: u.level ?? 'novice',
			badges: u.badges ?? [],
			isCurrentUser: u._id.toString() === locals.user!.id
		}));

		// Make sure current user appears even if not in top 50
		const currentUserInList = leaderboard.some((e) => e.isCurrentUser);
		let currentUserEntry = null;
		if (!currentUserInList) {
			const me = await User.findById(locals.user.id).select('name xp level badges');
			if (me) {
				const totalAbove = await User.countDocuments({ xp: { $gt: me.xp ?? 0 } });
				currentUserEntry = {
					rank: totalAbove + 1,
					id: me._id.toString(),
					name: me.name,
					xp: me.xp ?? 0,
					level: me.level ?? 'novice',
					badges: me.badges ?? [],
					isCurrentUser: true
				};
			}
		}

		return json({ leaderboard, currentUserEntry });
	} catch (err) {
		console.error('GET /api/leaderboard error:', err);
		throw error(500, 'Failed to fetch leaderboard');
	}
}
