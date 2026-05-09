import { connectDB } from '$lib/server/db.js';
import Bean from '$lib/server/models/Bean.js';
import Shot from '$lib/server/models/Shot.js';

export async function load() {
  await connectDB();

  const [totalShots, shots, totalBeans] = await Promise.all([
    Shot.countDocuments(),
    Shot.find().sort({ createdAt: -1 }).limit(10).lean(),
    Bean.countDocuments()
  ]);

  const ratingAgg = await Shot.aggregate([
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);
  const avgRating = ratingAgg[0]?.avg ?? 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const activeBeanIds = await Shot.distinct('beanId', { createdAt: { $gte: thirtyDaysAgo } });

  const bestBeanAgg = await Shot.aggregate([
    { $group: { _id: '$beanId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    { $match: { count: { $gte: 1 } } },
    { $sort: { avg: -1 } },
    { $limit: 1 }
  ]);

  let bestBeanName = null;
  if (bestBeanAgg[0]) {
    const bean = await Bean.findById(bestBeanAgg[0]._id).lean();
    bestBeanName = bean?.name ?? null;
  }

  const beanIds = [...new Set(shots.map(s => s.beanId.toString()))];
  const beans = await Bean.find({ _id: { $in: beanIds } }).lean();
  const beanMap = Object.fromEntries(beans.map(b => [b._id.toString(), b.name]));

  const lastShots = shots.slice(0, 3).map(s => ({
    _id: s._id.toString(),
    beanId: s.beanId.toString(),
    beanName: beanMap[s.beanId.toString()] ?? '—',
    rating: s.rating,
    dose: s.dose,
    yieldG: s.yieldG,
    extractionTime: s.extractionTime,
    brewRatio: s.brewRatio,
    createdAt: s.createdAt?.toISOString() ?? null
  }));

  const chartData = shots.slice(0, 10).reverse().map(s => ({
    rating: s.rating,
    date: new Date(s.createdAt).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' })
  }));

  return {
    totalShots,
    totalBeans,
    avgRating: Math.round(avgRating * 10) / 10,
    activeBeans: activeBeanIds.length,
    bestBeanName,
    lastShots,
    chartData
  };
}
