import { connectDB } from '$lib/server/db.js';
import Bean from '$lib/server/models/Bean.js';
import Shot from '$lib/server/models/Shot.js';
import { fail } from '@sveltejs/kit';

export async function load() {
  await connectDB();
  const beans = await Bean.find().sort({ createdAt: -1 }).lean();
  return { beans: JSON.parse(JSON.stringify(beans)) };
}

export const actions = {
  default: async ({ request }) => {
    await connectDB();
    const data = await request.formData();

    const beanId        = data.get('beanId');
    const dose          = parseFloat(data.get('dose'));
    const grindSize     = parseFloat(data.get('grindSize'));
    const extractionTime = parseFloat(data.get('extractionTime'));
    const yieldG        = parseFloat(data.get('yield'));
    const temperature   = data.get('temperature') || '2';
    const rating        = parseInt(data.get('rating'));
    const flavorTags    = data.getAll('flavorTags');
    const notes         = data.get('notes') || '';

    if (!beanId || isNaN(dose) || isNaN(grindSize) || isNaN(extractionTime) || isNaN(yieldG) || isNaN(rating)) {
      return fail(400, { error: 'Bitte alle Pflichtfelder ausfüllen.' });
    }

    const brewRatio = Math.round((yieldG / dose) * 100) / 100;

    await Shot.create({
      beanId,
      dose,
      grindSize,
      extractionTime,
      yield: yieldG,
      temperature,
      rating,
      brewRatio,
      flavorTags,
      notes
    });

    return { success: true };
  }
};
