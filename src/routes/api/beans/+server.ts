import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Bean } from '$lib/server/models/Bean';

const DEFAULT_BEANS = [
	{
		name: 'Yirgacheffe G1',
		roastery: 'Moonlight Roasters',
		origin: 'Ethiopia',
		tags: ['Floral', 'Lemon Tart', 'Tea-like'],
		dose: '18.5g',
		yield: '38g',
		time: '28s',
		status: 'Fresh',
		img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: true
	},
	{
		name: 'Huila Pink Bourbon',
		roastery: 'Vanguard Lab',
		origin: 'Colombia',
		tags: ['Stone Fruit', 'Vanilla', 'Brown Sugar'],
		dose: '19g',
		yield: '40g',
		time: '32s',
		status: 'Peak',
		img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		name: 'Cerrado Amarelo',
		roastery: 'Altitude Roasters',
		origin: 'Brazil',
		tags: ['Dark Chocolate', 'Hazelnut', 'Caramel'],
		dose: '18g',
		yield: '36g',
		time: '30s',
		status: 'Past Peak',
		img: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		name: 'Nyeri AA',
		roastery: 'Nordic Roast Co.',
		origin: 'Kenya',
		tags: ['Tomato', 'Blackcurrant', 'Wine'],
		dose: '18.5g',
		yield: '37g',
		time: '26s',
		status: 'Fresh',
		img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: true
	}
];

export async function GET() {
	try {
		await connectDB();
		let beans = await Bean.find().sort({ createdAt: -1 });
		if (beans.length === 0) {
			beans = await Bean.insertMany(DEFAULT_BEANS);
		}
		return json(beans.map((b) => b.toJSON()));
	} catch (err) {
		console.error('GET /api/beans error:', err);
		throw error(500, 'Failed to fetch beans');
	}
}

export async function POST({ request }) {
	try {
		await connectDB();
		const data = await request.json();
		const bean = new Bean(data);
		await bean.save();
		return json(bean.toJSON(), { status: 201 });
	} catch (err) {
		console.error('POST /api/beans error:', err);
		throw error(500, 'Failed to save bean');
	}
}

export async function DELETE() {
	try {
		await connectDB();
		await Bean.deleteMany({});
		const beans = await Bean.insertMany(DEFAULT_BEANS);
		return json(beans.map((b) => b.toJSON()));
	} catch (err) {
		console.error('DELETE /api/beans error:', err);
		throw error(500, 'Failed to reset beans');
	}
}
