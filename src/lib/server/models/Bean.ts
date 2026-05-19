import mongoose, { type Document } from 'mongoose';

export interface IBean extends Document {
	id: string;
	name: string;
	roastery: string;
	origin: string;
	tags: string[];
	dose: string;
	yield: string;
	time: string;
	status: 'Fresh' | 'Peak' | 'Past Peak';
	img: string;
	favorited: boolean;
}

const beanSchema = new mongoose.Schema<IBean>(
	{
		name: { type: String, required: true },
		roastery: { type: String, default: '' },
		origin: { type: String, default: '' },
		tags: { type: [String], default: [] },
		dose: { type: String, default: '18g' },
		yield: { type: String, default: '36g' },
		time: { type: String, default: '30s' },
		status: {
			type: String,
			enum: ['Fresh', 'Peak', 'Past Peak'],
			default: 'Fresh'
		},
		img: { type: String, default: '' },
		favorited: { type: Boolean, default: false }
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

export const Bean = mongoose.models.Bean ?? mongoose.model<IBean>('Bean', beanSchema);
