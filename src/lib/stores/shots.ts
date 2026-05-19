import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Shot {
	id: string;
	bean: string;
	dose: number;
	yield: number;
	time: number;
	temp: number;
	grind: string;
	notes: string;
	rating: number;
	date: string;
	process: string;
	roast: string;
	img: string;
}

const DEFAULT_SHOTS: Shot[] = [
	{
		id: '1',
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
		id: '2',
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
		id: '3',
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
		id: '4',
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

function createShotsStore() {
	const stored = browser ? localStorage.getItem('beanery-shots') : null;
	const initial: Shot[] = stored ? JSON.parse(stored) : DEFAULT_SHOTS;

	const { subscribe, set, update } = writable<Shot[]>(initial);

	function persist(shots: Shot[]) {
		if (browser) localStorage.setItem('beanery-shots', JSON.stringify(shots));
		return shots;
	}

	return {
		subscribe,
		add(shot: Shot) {
			update((shots) => persist([shot, ...shots]));
		},
		remove(id: string) {
			update((shots) => persist(shots.filter((s) => s.id !== id)));
		},
		reset() {
			set(persist(DEFAULT_SHOTS));
		}
	};
}

export const shots = createShotsStore();
