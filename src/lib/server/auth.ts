import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export interface SessionUser {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user';
	skillLevel: 'beginner' | 'home_barista' | 'expert';
	machineType: string;
	onboardingCompleted: boolean;
	xp: number;
	level: string;
}

function getSecret(): string {
	const secret = env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET environment variable is not set');
	return secret;
}

export function signToken(user: SessionUser): string {
	return jwt.sign(user, getSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionUser | null {
	try {
		return jwt.verify(token, getSecret()) as SessionUser;
	} catch {
		return null;
	}
}
