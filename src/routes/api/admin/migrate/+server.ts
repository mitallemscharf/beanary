import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Shot } from '$lib/server/models/Shot';
import { Bean } from '$lib/server/models/Bean';

// POST /api/admin/migrate — backfill brewRatio and beanId on all existing shots
// Admin-only; safe to run multiple times (idempotent).
export async function POST({ locals }) {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Admin only');
	}

	try {
		await connectDB();

		const shots = await Shot.find({});
		const beans = await Bean.find({});

		// Build a name → ObjectId lookup for fast matching
		const beanByName = new Map<string, string>();
		for (const b of beans) {
			beanByName.set(b.name.toLowerCase().trim(), b._id.toString());
		}

		let updatedRatio = 0;
		let updatedBeanId = 0;

		for (const shot of shots) {
			const updates: Record<string, unknown> = {};

			// Backfill brewRatio if missing or zero
			if (!shot.brewRatio && shot.dose > 0) {
				updates.brewRatio = Math.round((shot.yield / shot.dose) * 100) / 100;
				updatedRatio++;
			}

			// Backfill beanId if missing — match by bean name (case-insensitive)
			if (!shot.beanId) {
				const matchedId = beanByName.get(shot.bean.toLowerCase().trim());
				if (matchedId) {
					updates.beanId = matchedId;
					updatedBeanId++;
				}
			}

			if (Object.keys(updates).length > 0) {
				await Shot.findByIdAndUpdate(shot._id, updates);
			}
		}

		return json({
			success: true,
			totalShots: shots.length,
			updatedBrewRatio: updatedRatio,
			updatedBeanId: updatedBeanId
		});
	} catch (err) {
		console.error('Migration error:', err);
		throw error(500, 'Migration failed');
	}
}
