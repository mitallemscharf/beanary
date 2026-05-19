import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Bean } from '$lib/server/models/Bean';

export async function DELETE({ params }) {
	try {
		await connectDB();
		const bean = await Bean.findByIdAndDelete(params.id);
		if (!bean) throw error(404, 'Bean not found');
		return json({ success: true });
	} catch (err) {
		console.error('DELETE /api/beans/[id] error:', err);
		throw error(500, 'Failed to delete bean');
	}
}

export async function PATCH({ params, request }) {
	try {
		await connectDB();
		const data = await request.json();

		let update: Record<string, unknown> = data;

		if (data.action === 'toggleFav') {
			const bean = await Bean.findById(params.id);
			if (!bean) throw error(404, 'Bean not found');
			update = { favorited: !bean.favorited };
		}

		const updated = await Bean.findByIdAndUpdate(params.id, update, { new: true });
		if (!updated) throw error(404, 'Bean not found');
		return json(updated.toJSON());
	} catch (err) {
		console.error('PATCH /api/beans/[id] error:', err);
		throw error(500, 'Failed to update bean');
	}
}
