import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { Bean } from '$lib/server/models/Bean';
import { Shot } from '$lib/server/models/Shot';

export async function GET({ locals }) {
	try {
		await connectDB();

		// hooks.server.ts already guards this — locals.user is guaranteed admin here
		const [allUsers, totalBeans, totalShots, recentShots] = await Promise.all([
			User.find({}).select('name email role createdAt').lean(),
			Bean.countDocuments(),
			Shot.countDocuments(),
			Shot.find({}).sort({ createdAt: -1 }).limit(8).lean()
		]);

		// Per-user counts — countDocuments is reliable regardless of ObjectId/string edge cases
		const users = await Promise.all(
			allUsers.map(async (u) => {
				const id = u._id.toString();
				const [beanCount, shotCount] = await Promise.all([
					Bean.countDocuments({ userId: id }),
					Shot.countDocuments({ userId: id })
				]);
				return {
					id,
					name: u.name as string,
					email: u.email as string,
					role: u.role as string,
					createdAt: u.createdAt as string,
					beanCount,
					shotCount
				};
			})
		);

		const nameMap: Record<string, string> = Object.fromEntries(users.map((u) => [u.id, u.name]));

		const activity = recentShots.map((s) => ({
			id: s._id.toString(),
			bean: s.bean,
			rating: s.rating,
			time: s.time,
			img: s.img,
			date: s.date,
			userId: s.userId,
			userName: nameMap[s.userId] ?? 'Unknown'
		}));

		return json({
			totalUsers: allUsers.length,
			totalBeans,
			totalShots,
			users,
			activity
		});
	} catch (err) {
		console.error('GET /api/admin/stats error:', err);
		throw error(500, 'Failed to fetch admin stats');
	}
}

export async function DELETE({ request, locals }) {
	// Admin delete any bean or shot by id + type
	try {
		await connectDB();
		const { type, id } = await request.json();

		if (type === 'bean') {
			await Bean.findByIdAndDelete(id);
		} else if (type === 'shot') {
			await Shot.findByIdAndDelete(id);
		} else if (type === 'user') {
			const user = await User.findById(id);
			if (!user) throw error(404, 'User not found');
			// Don't allow deleting yourself
			if (user._id.toString() === locals.user!.id) throw error(400, 'Cannot delete yourself');
			await User.findByIdAndDelete(id);
			await Bean.deleteMany({ userId: id });
			await Shot.deleteMany({ userId: id });
		} else {
			throw error(400, 'Invalid type');
		}

		return json({ success: true });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('DELETE /api/admin/stats error:', err);
		throw error(500, 'Delete failed');
	}
}
