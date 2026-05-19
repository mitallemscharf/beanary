import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Bean } from '$lib/server/models/Bean';

const DEFAULT_BEANS = [
	// ── Panama — Boquete Coffee Traders ──
	{
		name: 'Kotowa Arabica',
		roastery: 'Boquete Coffee Traders / Kotowa',
		origin: 'Panama, Boquete',
		tags: ['Dark Chocolate', 'Roasted Almond', 'Brown Sugar', 'Citrus'],
		dose: '18g',
		yield: '36g',
		time: '28s',
		status: 'Fresh',
		img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: true
	},
	{
		name: 'Don Pepe Estate Caturra Washed',
		roastery: 'Boquete Coffee Traders',
		origin: 'Panama, Boquete',
		tags: ['Sweet', 'Balanced', 'Citrus', 'Honey'],
		dose: '18g',
		yield: '36g',
		time: '28s',
		status: 'Peak',
		img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		name: 'Janson Family Arabica Washed',
		roastery: 'Boquete Coffee Traders',
		origin: 'Panama, Boquete',
		tags: ['Fruity', 'Sweet', 'Clean'],
		dose: '18g',
		yield: '38g',
		time: '30s',
		status: 'Peak',
		img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		name: 'Café Palo Alto',
		roastery: 'Boquete Coffee Traders',
		origin: 'Panama, Boquete',
		tags: ['Bold', 'Full Body', 'Caramel'],
		dose: '18g',
		yield: '34g',
		time: '26s',
		status: 'Peak',
		img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	// ── World Specialty Classics ──
	{
		name: 'Yirgacheffe G1 Washed',
		roastery: 'Moonlight Roasters',
		origin: 'Ethiopia, Yirgacheffe',
		tags: ['Jasmine', 'Bergamot', 'Lemon', 'Tea-like'],
		dose: '18.5g',
		yield: '38g',
		time: '28s',
		status: 'Peak',
		img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: true
	},
	{
		name: 'Huila Pink Bourbon',
		roastery: 'Vanguard Lab',
		origin: 'Colombia, Huila',
		tags: ['Stone Fruit', 'Vanilla', 'Brown Sugar', 'Rose'],
		dose: '19g',
		yield: '40g',
		time: '30s',
		status: 'Fresh',
		img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		name: 'Cerrado Amarelo',
		roastery: 'Altitude Roasters',
		origin: 'Brazil, Cerrado',
		tags: ['Dark Chocolate', 'Hazelnut', 'Caramel'],
		dose: '18g',
		yield: '36g',
		time: '27s',
		status: 'Past Peak',
		img: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
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
