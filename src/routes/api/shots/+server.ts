import { json, error } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Shot } from '$lib/server/models/Shot';

const DEFAULT_SHOTS = [
	{
		bean: 'Ethiopia Yirgacheffe',
		dose: 18.5,
		yield: 37.0,
		time: 28,
		temp: 93,
		grind: '2.4 / 12 clicks',
		notes: 'Bergamot, jasmine, bright clean acidity. Silky mouthfeel.',
		rating: 5,
		date: 'Today',
		process: 'Washed Process',
		roast: 'Light Roast',
		img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=200&h=200&auto=format&fit=crop&q=80'
	},
	{
		bean: 'Colombia Huila',
		dose: 19.0,
		yield: 42.0,
		time: 24,
		temp: 91,
		grind: '2.7 / 15 clicks',
		notes: 'Panela, stone fruit, slightly underextracted. Adjust grind finer.',
		rating: 3,
		date: 'Today',
		process: 'Natural Process',
		roast: 'Medium Roast',
		img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=200&h=200&auto=format&fit=crop&q=80'
	},
	{
		bean: 'Brazil Cerrado',
		dose: 18.0,
		yield: 36.0,
		time: 31,
		temp: 92,
		grind: '2.2 / 10 clicks',
		notes: 'Dark chocolate, hazelnut, smooth body. Great for espresso blends.',
		rating: 4,
		date: 'Yesterday',
		process: 'Pulped Natural',
		roast: 'Dark Roast',
		img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=200&h=200&auto=format&fit=crop&q=80'
	},
	{
		bean: 'Kenya AA Nyeri',
		dose: 18.5,
		yield: 45.0,
		time: 22,
		temp: 95,
		grind: '3.1 / 18 clicks',
		notes: 'Tomato-like acidity, overextracted. Too long shot time.',
		rating: 2,
		date: 'October 24, 2024',
		process: 'Washed',
		roast: 'Light-Nordic Roast',
		img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=200&auto=format&fit=crop&q=80'
	}
];

export async function GET() {
	try {
		await connectDB();
		let shots = await Shot.find().sort({ createdAt: -1 });
		if (shots.length === 0) {
			shots = await Shot.insertMany(DEFAULT_SHOTS);
		}
		return json(shots.map((s) => s.toJSON()));
	} catch (err) {
		console.error('GET /api/shots error:', err);
		throw error(500, 'Failed to fetch shots');
	}
}

export async function POST({ request }) {
	try {
		await connectDB();
		const data = await request.json();
		const shot = new Shot(data);
		await shot.save();
		return json(shot.toJSON(), { status: 201 });
	} catch (err) {
		console.error('POST /api/shots error:', err);
		throw error(500, 'Failed to save shot');
	}
}

export async function DELETE() {
	try {
		await connectDB();
		await Shot.deleteMany({});
		const shots = await Shot.insertMany(DEFAULT_SHOTS);
		return json(shots.map((s) => s.toJSON()));
	} catch (err) {
		console.error('DELETE /api/shots error:', err);
		throw error(500, 'Failed to reset shots');
	}
}
