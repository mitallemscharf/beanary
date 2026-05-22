import { User } from './models/User';

export const XP = {
	LOG_SHOT:    10,
	RATE_SHOT:    5,
	ADD_BEAN:    15,
	ADD_NOTES:    5,
	DAILY_LOGIN:  5,
	STREAK_7:    50
} as const;

export const LEVELS = [
	{ name: 'novice',       minXp: 0    },
	{ name: 'apprentice',   minXp: 100  },
	{ name: 'home_barista', minXp: 500  },
	{ name: 'enthusiast',   minXp: 1000 },
	{ name: 'expert',       minXp: 2500 },
	{ name: 'master',       minXp: 5000 }
] as const;

export function computeLevel(xp: number): string {
	for (let i = LEVELS.length - 1; i >= 0; i--) {
		if (xp >= LEVELS[i].minXp) return LEVELS[i].name;
	}
	return 'novice';
}

export function levelLabel(level: string): string {
	const map: Record<string, string> = {
		novice:       'Novice ☕',
		apprentice:   'Apprentice 🌱',
		home_barista: 'Home Barista ☕☕',
		enthusiast:   'Enthusiast 🏅',
		expert:       'Expert 🏆',
		master:       'Master Roaster 👑'
	};
	return map[level] ?? level;
}

export function nextLevelXp(xp: number): { next: string; needed: number; current: number; total: number } {
	for (let i = 0; i < LEVELS.length - 1; i++) {
		if (xp < LEVELS[i + 1].minXp) {
			return {
				next: LEVELS[i + 1].name,
				needed: LEVELS[i + 1].minXp - xp,
				current: xp - LEVELS[i].minXp,
				total: LEVELS[i + 1].minXp - LEVELS[i].minXp
			};
		}
	}
	return { next: 'max', needed: 0, current: xp, total: xp };
}

export const BADGES: Record<string, { label: string; emoji: string; desc: string }> = {
	first_drop:     { emoji: '☕', label: 'First Drop',     desc: 'Log your first shot' },
	getting_started:{ emoji: '🔟', label: 'Getting Started',desc: 'Log 10 shots' },
	century_brewer: { emoji: '💯', label: 'Century Brewer', desc: 'Log 100 shots' },
	shot_master:    { emoji: '🏆', label: 'Shot Master',    desc: 'Log 1000 shots' },
	perfectionist:  { emoji: '⭐', label: 'Perfectionist',  desc: '5 shots with 5 stars in a row' },
	world_explorer: { emoji: '🌍', label: 'World Explorer', desc: 'Beans from 5 different countries' },
	bean_collector: { emoji: '🫘', label: 'Bean Collector', desc: 'Add 10 different beans' },
	dedicated:      { emoji: '📅', label: 'Dedicated',      desc: 'Log shots 7 days in a row' },
	graduated:      { emoji: '🎓', label: 'Graduated',      desc: 'Change skill level from Beginner' },
	early_bird:     { emoji: '🌅', label: 'Early Bird',     desc: 'Log a shot before 7am' },
	night_owl:      { emoji: '🌙', label: 'Night Owl',      desc: 'Log a shot after 10pm' },
	speed_runner:   { emoji: '⚡', label: 'Speed Runner',   desc: 'Extraction under 25 seconds' },
	dialed_in:      { emoji: '🏅', label: 'Dialed In',      desc: '5-star rating 3 times with same bean' }
};

export async function awardXP(
	userId: string,
	amount: number,
	checkBadges?: (user: InstanceType<typeof User>) => string[]
): Promise<{ newBadges: string[]; leveledUp: boolean; newLevel: string }> {
	const user = await User.findById(userId);
	if (!user) return { newBadges: [], leveledUp: false, newLevel: '' };

	const oldLevel = user.level;
	user.xp = (user.xp ?? 0) + amount;
	user.level = computeLevel(user.xp);

	const newBadges: string[] = [];
	if (checkBadges) {
		const earned = checkBadges(user);
		for (const badge of earned) {
			if (!user.badges.includes(badge)) {
				user.badges.push(badge);
				newBadges.push(badge);
			}
		}
	}

	await user.save();

	return {
		newBadges,
		leveledUp: user.level !== oldLevel,
		newLevel: user.level
	};
}
