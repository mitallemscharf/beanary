import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { Bean } from '$lib/server/models/Bean';
import { Shot } from '$lib/server/models/Shot';

// Seeds default users and migrates orphaned data to admin
export async function POST() {
	try {
		await connectDB();

		// Create admin if not exists, always ensure onboardingCompleted: true
		let admin = await User.findOne({ email: 'lenny@beanery.app' });
		if (!admin) {
			admin = new User({
				name: 'Lenny Frei',
				email: 'lenny@beanery.app',
				password: 'Beanery2026',
				role: 'admin',
				onboardingCompleted: true
			});
			await admin.save();
		} else if (!admin.onboardingCompleted) {
			await User.updateOne({ email: 'lenny@beanery.app' }, { $set: { onboardingCompleted: true } });
		}

		// Create test user if not exists
		const testExists = await User.findOne({ email: 'test@beanery.app' });
		if (!testExists) {
			const testUser = new User({
				name: 'Test User',
				email: 'test@beanery.app',
				password: 'Test2026',
				role: 'user'
			});
			await testUser.save();
		}

		const adminId = admin._id.toString();

		// Migrate all beans/shots with no/empty userId to belong to admin
		const noUser = { $or: [{ userId: '' }, { userId: { $exists: false } }] };
		const beanResult = await Bean.updateMany(noUser, { $set: { userId: adminId } });
		const shotResult = await Shot.updateMany(noUser, { $set: { userId: adminId } });

		return json({
			success: true,
			adminId,
			beansMigrated: beanResult.modifiedCount,
			shotsMigrated: shotResult.modifiedCount
		});
	} catch (err) {
		console.error('POST /api/auth/seed error:', err);
		throw error(500, 'Seed failed');
	}
}
