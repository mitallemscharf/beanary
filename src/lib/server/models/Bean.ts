import mongoose, { type Document } from 'mongoose';

export interface IBean extends Document {
	id: string;
	userId: string;
	name: string;
	roastery: string;
	origin: string;
	roastLevel?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
	tags: string[];
	dose: string;
	yield: string;
	time: string;
	status: 'Fresh' | 'Peak' | 'Past Peak';
	roastDate?: Date;
	img: string;
	favorited: boolean;
}

const beanSchema = new mongoose.Schema<IBean>(
	{
		userId: { type: String, default: '' },
		name: { type: String, required: true },
		roastery: { type: String, default: '' },
		origin: { type: String, default: '' },
		roastLevel: { type: String, enum: ['Light', 'Medium', 'Medium-Dark', 'Dark'], default: undefined },
		tags: { type: [String], default: [] },
		dose: { type: String, default: '18g' },
		yield: { type: String, default: '36g' },
		time: { type: String, default: '30s' },
		status: {
			type: String,
			enum: ['Fresh', 'Peak', 'Past Peak'],
			default: 'Fresh'
		},
		roastDate: { type: Date, required: false },
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
