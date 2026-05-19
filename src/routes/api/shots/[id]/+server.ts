import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Shot } from '$lib/server/models/Shot';

export async function DELETE({ params }) {
	try {
		await connectDB();
		const shot = await Shot.findByIdAndDelete(params.id);
		if (!shot) throw error(404, 'Shot not found');
		return json({ success: true });
	} catch (err) {
		console.error('DELETE /api/shots/[id] error:', err);
		throw error(500, 'Failed to delete shot');
	}
}

export async function PATCH({ params, request }) {
	try {
		await connectDB();
		const data = await request.json();
		const shot = await Shot.findByIdAndUpdate(params.id, data, { new: true });
		if (!shot) throw error(404, 'Shot not found');
		return json(shot.toJSON());
	} catch (err) {
		console.error('PATCH /api/shots/[id] error:', err);
		throw error(500, 'Failed to update shot');
	}
}
