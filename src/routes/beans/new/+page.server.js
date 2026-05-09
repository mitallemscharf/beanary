import { connectDB } from '$lib/server/db.js';
import Bean from '$lib/server/models/Bean.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    await connectDB();
    const data = await request.formData();

    const name       = data.get('name')?.trim();
    const roaster    = data.get('roaster')?.trim();
    const origin     = data.get('origin')?.trim() || '';
    const roastDate  = data.get('roastDate') || null;
    const roastLevel = data.get('roastLevel') || 'medium';
    const flavorTags = data.getAll('flavorTags');
    const notes      = data.get('notes')?.trim() || '';

    if (!name || !roaster) {
      return fail(400, { error: 'Name und Röster sind Pflichtfelder.' });
    }

    await Bean.create({
      name,
      roaster,
      origin,
      roastDate: roastDate ? new Date(roastDate) : undefined,
      roastLevel,
      flavorTags,
      notes
    });

    redirect(303, '/beans');
  }
};
