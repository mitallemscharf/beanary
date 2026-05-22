// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			user?: {
				id: string;
				name: string;
				email: string;
				role: 'admin' | 'user';
				skillLevel: 'beginner' | 'home_barista' | 'expert';
				machineType: string;
				onboardingCompleted: boolean;
				xp: number;
				level: string;
			};
		}
	}
}

export {};
