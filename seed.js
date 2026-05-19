// One-time seed script — run with: node seed.js
import mongoose from 'mongoose';

const MONGODB_URI =
	'mongodb+srv://admin:Admin1234@cluster0.yuemosk.mongodb.net/beanery?retryWrites=true&w=majority';

const beanSchema = new mongoose.Schema(
	{
		name: String,
		roastery: String,
		origin: String,
		tags: [String],
		dose: String,
		yield: String,
		time: String,
		status: String,
		img: String,
		favorited: Boolean
	},
	{ timestamps: true }
);

beanSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
	}
});

const Bean = mongoose.models.Bean ?? mongoose.model('Bean', beanSchema);

const NEW_BEANS = [
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

console.log('Connecting to MongoDB Atlas…');
await mongoose.connect(MONGODB_URI);
console.log('Connected.');

// Insert only — do not touch existing Panama beans
const inserted = await Bean.insertMany(NEW_BEANS);
console.log(`\n✓ Inserted ${inserted.length} new beans into MongoDB:\n`);
inserted.forEach((b) => console.log(`  • ${b.name} (${b.origin}) — ${b.status}`));

const total = await Bean.countDocuments();
console.log(`\n Total beans in database: ${total}`);

await mongoose.disconnect();
console.log('Done. Refresh your app to see all beans.');
