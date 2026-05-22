import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { Shot } from '$lib/server/models/Shot';
import { Bean } from '$lib/server/models/Bean';
import { nextLevelXp, levelLabel, BADGES } from '$lib/server/gamification';

export const load: PageServerLoad = async ({ locals }) => {
	await connectDB();
	const userId = locals.user!.id;

	const [userDoc, shots, beans] = await Promise.all([
		User.findById(userId),
		Shot.find({ userId }).sort({ createdAt: -1 }),
		Bean.find({ userId })
	]);

	const xp = userDoc?.xp ?? 0;
	const level = userDoc?.level ?? 'novice';
	const badges = userDoc?.badges ?? [];
	const levelInfo = nextLevelXp(xp);

	const avgRating = shots.length ? shots.reduce((s, sh) => s + (sh.rating ?? 0), 0) / shots.length : 0;
	const beanCounts: Record<string, number> = {};
	for (const sh of shots) beanCounts[sh.bean] = (beanCounts[sh.bean] ?? 0) + 1;
	const favBean = Object.entries(beanCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

	const originCounts: Record<string, number> = {};
	for (const b of beans) {
		const country = b.origin?.split(',').pop()?.trim() ?? b.origin ?? 'Unknown';
		originCounts[country] = (originCounts[country] ?? 0) + 1;
	}
	const favOrigin = Object.entries(originCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

	return {
		profile: {
			name: userDoc?.name ?? locals.user!.name,
			email: userDoc?.email ?? locals.user!.email,
			skillLevel: (userDoc?.skillLevel ?? 'home_barista') as string,
			machineType: (userDoc?.machineType ?? 'espresso_semi') as string,
			goals: (userDoc?.goals ?? []) as string[],
			isPublicOnLeaderboard: userDoc?.isPublicOnLeaderboard ?? true,
			memberSince: userDoc?.createdAt ? new Date(userDoc.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'
		},
		xp,
		level,
		levelLabel: levelLabel(level),
		levelInfo,
		badges: badges as string[],
		allBadges: Object.entries(BADGES).map(([id, b]) => ({ id, ...b, earned: badges.includes(id) })),
		stats: {
			totalShots: shots.length,
			totalBeans: beans.length,
			avgRating: avgRating.toFixed(2),
			favBean,
			favOrigin
		}
	};
};
