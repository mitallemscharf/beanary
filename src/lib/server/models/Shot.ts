import mongoose, { type Document } from 'mongoose';

export interface IShot extends Document {
	id: string;
	userId: string;
	beanId?: mongoose.Types.ObjectId;
	bean: string;
	dose: number;
	yield: number;
	time: number;
	temp: number;
	grind: string;
	notes: string;
	rating: number;
	brewRatio?: number;
	flavorTags: string[];
	date: string;
	process: string;
	roast: string;
	img: string;
}

const shotSchema = new mongoose.Schema<IShot>(
	{
		userId: { type: String, default: '' },
		beanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bean', required: false },
		bean: { type: String, required: true },
		dose: { type: Number, required: true },
		yield: { type: Number, required: true },
		time: { type: Number, required: true },
		temp: { type: Number, default: 93 },
		grind: { type: String, default: '' },
		notes: { type: String, default: '' },
		rating: { type: Number, default: 3, min: 1, max: 5 },
		brewRatio: { type: Number },
		flavorTags: { type: [String], default: [] },
		date: { type: String, default: 'Today' },
		process: { type: String, default: 'Washed' },
		roast: { type: String, default: 'Light Roast' },
		img: { type: String, default: '' }
	},
	{ timestamps: true }
);

shotSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
	}
});

export const Shot = mongoose.models.Shot ?? mongoose.model<IShot>('Shot', shotSchema);
