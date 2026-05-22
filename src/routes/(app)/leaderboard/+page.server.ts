import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { levelLabel } from '$lib/server/gamification';

export const load: PageServerLoad = async ({ locals }) => {
	await connectDB();

	const users = await User.find({ isPublicOnLeaderboard: { $ne: false } })
		.select('name xp level badges createdAt')
		.sort({ xp: -1 })
		.limit(25);

	const leaderboard = users.map((u, i) => ({
		rank: i + 1,
		id: u._id.toString(),
		name: u.name,
		xp: u.xp ?? 0,
		level: u.level ?? 'novice',
		levelLabel: levelLabel(u.level ?? 'novice'),
		badgeCount: (u.badges ?? []).length,
		isCurrentUser: u._id.toString() === locals.user!.id
	}));

	// Current user's rank if outside top 25
	let myRank: number | null = null;
	if (!leaderboard.some((e) => e.isCurrentUser)) {
		const me = await User.findById(locals.user!.id).select('xp');
		if (me) {
			myRank = (await User.countDocuments({ xp: { $gt: me.xp ?? 0 } })) + 1;
		}
	}

	return { leaderboard, myRank, currentUserId: locals.user!.id };
};
