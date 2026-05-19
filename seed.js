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

const REAL_BEANS = [
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
	}
];

console.log('Connecting to MongoDB Atlas…');
await mongoose.connect(MONGODB_URI);
console.log('Connected.');

// Clear existing beans and insert real ones
await Bean.deleteMany({});
console.log('Cleared existing beans.');

const inserted = await Bean.insertMany(REAL_BEANS);
console.log(`\n✓ Inserted ${inserted.length} beans into MongoDB:\n`);
inserted.forEach((b) => console.log(`  • ${b.name} (${b.status})`));

await mongoose.disconnect();
console.log('\nDone. Refresh your app to see the beans.');
