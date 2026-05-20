import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Shot } from '$lib/server/models/Shot';

export async function DELETE({ params, locals }) {
	try {
		await connectDB();
		const user = locals.user!;
		const shot = await Shot.findById(params.id);
		if (!shot) throw error(404, 'Shot not found');

		// Only admin or the shot's owner can delete it
		if (user.role !== 'admin' && shot.userId !== user.id) {
			throw error(403, 'Not authorized to delete this shot');
		}

		await shot.deleteOne();
		return json({ success: true });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('DELETE /api/shots/[id] error:', err);
		throw error(500, 'Failed to delete shot');
	}
}

export async function PATCH({ params, request, locals }) {
	try {
		await connectDB();
		const user = locals.user!;
		const shot = await Shot.findById(params.id);
		if (!shot) throw error(404, 'Shot not found');

		// Only admin or the shot's owner can update it
		if (user.role !== 'admin' && shot.userId !== user.id) {
			throw error(403, 'Not authorized to update this shot');
		}

		const data = await request.json();
		const updated = await Shot.findByIdAndUpdate(params.id, data, { new: true });
		if (!updated) throw error(404, 'Shot not found');
		return json(updated.toJSON());
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('PATCH /api/shots/[id] error:', err);
		throw error(500, 'Failed to update shot');
	}
}
