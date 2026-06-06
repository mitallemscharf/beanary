import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';

// PATCH /api/users/password — verify current password, set new one (pre-save hook hashes it)
export async function PATCH({ request, locals }) {
	if (!locals.user) throw error(401, 'Unauthorized');
	try {
		await connectDB();
		const { currentPassword, newPassword } = await request.json();

		if (!currentPassword || !newPassword) throw error(400, 'Missing required fields');
		if (newPassword.length < 6) throw error(400, 'New password must be at least 6 characters');

		const user = await User.findById(locals.user.id);
		if (!user) throw error(404, 'User not found');

		const valid = await user.comparePassword(currentPassword);
		if (!valid) return json({ ok: false, message: 'Current password is incorrect' }, { status: 400 });

		user.password = newPassword;
		await user.save();

		return json({ ok: true });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('PATCH /api/users/password error:', err);
		throw error(500, 'Password update failed');
	}
}
