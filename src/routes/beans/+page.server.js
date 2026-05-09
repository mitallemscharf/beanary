import { connectDB } from '$lib/server/db.js';
import Bean from '$lib/server/models/Bean.js';
import Shot from '$lib/server/models/Shot.js';

export async function load() {
  await connectDB();

  const beans = await Bean.find().sort({ createdAt: -1 }).lean();

  const shotStats = await Shot.aggregate([
    {
      $group: {
        _id: '$beanId',
        shotCount: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const statsMap = Object.fromEntries(
    shotStats.map(s => [s._id.toString(), s])
  );

  const beansWithStats = beans.map(b => ({
    ...b,
    _id: b._id.toString(),
    roastDate: b.roastDate?.toISOString() ?? null,
    createdAt: b.createdAt?.toISOString() ?? null,
    shotCount: statsMap[b._id.toString()]?.shotCount ?? 0,
    avgRating: statsMap[b._id.toString()]?.avgRating ?? null
  }));

  return { beans: beansWithStats };
}
