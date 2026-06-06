import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		name:     { type: String, required: true, trim: true },
		email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		role:     { type: String, enum: ['admin', 'user'], default: 'user' },
		// Profile
		skillLevel:   { type: String, enum: ['beginner', 'home_barista', 'expert'], default: 'home_barista' },
		machineType:  { type: String, default: 'espresso_semi' },
		goals:        [{ type: String }],
		// Gamification
		xp:            { type: Number, default: 0 },
		level:         { type: String, default: 'novice' },
		badges:        [{ type: String }],
		lastLoginDate: { type: String, default: '' },
		// UX
		onboardingCompleted:    { type: Boolean, default: false },
		isPublicOnLeaderboard:  { type: Boolean, default: true },
		// Notifications
		notifications: {
			dailyReminder:       { type: Boolean, default: false },
			weeklySummary:       { type: Boolean, default: false },
			beanFreshnessAlerts: { type: Boolean, default: false }
		},
		// Extraction defaults
		defaultDose:  { type: Number, default: 18 },
		defaultYield: { type: Number, default: 36 },
		defaultTemp:  { type: Number, default: 94 },
		defaultGrind: { type: Number, default: 15 },
		// Password reset
		resetToken:  { type: String },
		resetExpiry: { type: Date }
	},
	{ timestamps: true }
);

userSchema.set('toJSON', {
	transform: (_doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		delete ret.password;
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
	skillLevel: 'beginner' | 'home_barista' | 'expert';
	machineType: string;
	goals: string[];
	xp: number;
	level: string;
	badges: string[];
	onboardingCompleted: boolean;
	isPublicOnLeaderboard: boolean;
	notifications?: { dailyReminder: boolean; weeklySummary: boolean; beanFreshnessAlerts: boolean };
	defaultDose?: number;
	defaultYield?: number;
	defaultTemp?: number;
	defaultGrind?: number;
	resetToken?: string;
	resetExpiry?: Date;
}

export const User = mongoose.models.User ?? mongoose.model('User', userSchema);
