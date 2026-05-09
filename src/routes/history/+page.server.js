import { connectDB } from '$lib/server/db.js';
import Bean from '$lib/server/models/Bean.js';
import Shot from '$lib/server/models/Shot.js';
import mongoose from 'mongoose';

export async function load({ url }) {
  await connectDB();

  const beanFilter = url.searchParams.get('bean') || '';

  const query = beanFilter && mongoose.isValidObjectId(beanFilter)
    ? { beanId: beanFilter }
    : {};

  const shots = await Shot.find(query).sort({ createdAt: -1 }).lean();
  const beans = await Bean.find().sort({ name: 1 }).lean();

  const bestPerBean = {};
  for (const shot of shots) {
    const id = shot.beanId.toString();
    if (!bestPerBean[id] || shot.rating > bestPerBean[id].rating) {
      bestPerBean[id] = shot;
    }
  }
  const bestShotIds = new Set(Object.values(bestPerBean).map(s => s._id.toString()));

  const beanMap = Object.fromEntries(beans.map(b => [b._id.toString(), b.name]));

  function serializeShot(s) {
    return {
      ...s,
      _id: s._id.toString(),
      beanId: s.beanId.toString(),
      createdAt: s.createdAt?.toISOString() ?? null
    };
  }

  return {
    shots: shots.map(serializeShot),
    beans: beans.map(b => ({ _id: b._id.toString(), name: b.name })),
    beanMap,
    beanFilter,
    bestShotIds: [...bestShotIds]
  };
}
