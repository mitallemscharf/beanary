import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		role: { type: String, enum: ['admin', 'user'], default: 'user' }
	},
	{ timestamps: true }
);

userSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		delete ret.password; // never expose password hash
	}
});

userSchema.pre('save', async function () {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
	}
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

export interface IUser {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user';
}

export const User = mongoose.models.User ?? mongoose.model('User', userSchema);
