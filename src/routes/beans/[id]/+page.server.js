import { connectDB } from '$lib/server/db.js';
import Bean from '$lib/server/models/Bean.js';
import Shot from '$lib/server/models/Shot.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  await connectDB();

  const bean = await Bean.findById(params.id).lean();
  if (!bean) throw error(404, 'Bohne nicht gefunden');

  const shots = await Shot.find({ beanId: params.id }).sort({ createdAt: -1 }).lean();

  const sweetSpot = shots.reduce((best, s) => {
    if (!best || s.rating > best.rating) return s;
    return best;
  }, null);

  function serializeShot(s) {
    return {
      _id: s._id.toString(),
      beanId: s.beanId.toString(),
      dose: s.dose,
      grindSize: s.grindSize,
      extractionTime: s.extractionTime,
      yieldG: s.yieldG ?? s.yield ?? null,
      temperature: s.temperature,
      rating: s.rating,
      brewRatio: s.brewRatio ?? null,
      flavorTags: s.flavorTags ?? [],
      notes: s.notes ?? '',
      createdAt: s.createdAt?.toISOString() ?? null
    };
  }

  return {
    bean: {
      ...bean,
      _id: bean._id.toString(),
      roastDate: bean.roastDate?.toISOString() ?? null,
      createdAt: bean.createdAt?.toISOString() ?? null
    },
    shots: shots.map(serializeShot),
    sweetSpot: sweetSpot ? serializeShot(sweetSpot) : null
  };
}
