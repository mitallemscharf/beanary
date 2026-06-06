import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { Shot } from '$lib/server/models/Shot';
import { Bean } from '$lib/server/models/Bean';

// DELETE /api/users/account — delete user, their shots, and their beans; clear session
export async function DELETE({ locals, cookies }) {
	if (!locals.user) throw error(401, 'Unauthorized');
	try {
		await connectDB();
		const userId = locals.user.id;

		await Promise.all([
			Shot.deleteMany({ userId }),
			Bean.deleteMany({ userId })
		]);
		await User.findByIdAndDelete(userId);

		cookies.delete('session', { path: '/' });

		return json({ ok: true });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('DELETE /api/users/account error:', err);
		throw error(500, 'Account deletion failed');
	}
}
