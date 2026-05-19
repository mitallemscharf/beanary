import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Bean {
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

const DEFAULT_BEANS: Bean[] = [
	{
		id: '1',
		name: 'Yirgacheffe G1',
		roastery: 'Moonlight Roasters',
		origin: 'Ethiopia',
		tags: ['Floral', 'Lemon Tart', 'Tea-like'],
		dose: '18.5g',
		yield: '38g',
		time: '28s',
		status: 'Fresh',
		img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: true
	},
	{
		id: '2',
		name: 'Huila Pink Bourbon',
		roastery: 'Vanguard Lab',
		origin: 'Colombia',
		tags: ['Stone Fruit', 'Vanilla', 'Brown Sugar'],
		dose: '19g',
		yield: '40g',
		time: '32s',
		status: 'Peak',
		img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		id: '3',
		name: 'Cerrado Amarelo',
		roastery: 'Altitude Roasters',
		origin: 'Brazil',
		tags: ['Dark Chocolate', 'Hazelnut', 'Caramel'],
		dose: '18g',
		yield: '36g',
		time: '30s',
		status: 'Past Peak',
		img: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: false
	},
	{
		id: '4',
		name: 'Nyeri AA',
		roastery: 'Nordic Roast Co.',
		origin: 'Kenya',
		tags: ['Tomato', 'Blackcurrant', 'Wine'],
		dose: '18.5g',
		yield: '37g',
		time: '26s',
		status: 'Fresh',
		img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&auto=format&fit=crop&q=85',
		favorited: true
	}
];

function createBeansStore() {
	const stored = browser ? localStorage.getItem('beanery-beans') : null;
	const initial: Bean[] = stored ? JSON.parse(stored) : DEFAULT_BEANS;

	const { subscribe, set, update } = writable<Bean[]>(initial);

	function persist(list: Bean[]) {
		if (browser) localStorage.setItem('beanery-beans', JSON.stringify(list));
		return list;
	}

	return {
		subscribe,
		add(bean: Bean) {
			update((list) => persist([...list, bean]));
		},
		remove(id: string) {
			update((list) => persist(list.filter((b) => b.id !== id)));
		},
		toggleFav(id: string) {
			update((list) => persist(list.map((b) => (b.id === id ? { ...b, favorited: !b.favorited } : b))));
		},
		reset() {
			set(persist(DEFAULT_BEANS));
		}
	};
}

export const beans = createBeansStore();
