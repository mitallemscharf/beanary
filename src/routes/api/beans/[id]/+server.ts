import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Bean } from '$lib/server/models/Bean';

export async function DELETE({ params, locals }) {
	try {
		await connectDB();
		const user = locals.user!;
		const bean = await Bean.findById(params.id);
		if (!bean) throw error(404, 'Bean not found');

		// Only admin or the bean's owner can delete it
		if (user.role !== 'admin' && bean.userId !== user.id) {
			throw error(403, 'Not authorized to delete this bean');
		}

		await bean.deleteOne();
		return json({ success: true });
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('DELETE /api/beans/[id] error:', err);
		throw error(500, 'Failed to delete bean');
	}
}

export async function PATCH({ params, request, locals }) {
	try {
		await connectDB();
		const user = locals.user!;
		const data = await request.json();

		const bean = await Bean.findById(params.id);
		if (!bean) throw error(404, 'Bean not found');

		// Only admin or the bean's owner can update it
		if (user.role !== 'admin' && bean.userId !== user.id) {
			throw error(403, 'Not authorized to update this bean');
		}

		let updateData: Record<string, unknown> = data;

		if (data.action === 'toggleFav') {
			updateData = { favorited: !bean.favorited };
		}

		const updated = await Bean.findByIdAndUpdate(params.id, updateData, { new: true });
		if (!updated) throw error(404, 'Bean not found');
		return json(updated.toJSON());
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('PATCH /api/beans/[id] error:', err);
		throw error(500, 'Failed to update bean');
	}
}
