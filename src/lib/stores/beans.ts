import { writable } from 'svelte/store';

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

function createBeansStore() {
	const { subscribe, set, update } = writable<Bean[]>([]);

	return {
		subscribe,

		async load() {
			const res = await fetch('/api/beans');
			if (res.ok) {
				const data: Bean[] = await res.json();
				set(data);
			}
		},

		async add(beanData: Omit<Bean, 'id'>): Promise<Bean> {
			const res = await fetch('/api/beans', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(beanData)
			});
			if (!res.ok) throw new Error('Failed to save bean');
			const saved: Bean = await res.json();
			update((list) => [saved, ...list]);
			return saved;
		},

		async remove(id: string) {
			// Optimistic update
			update((list) => list.filter((b) => b.id !== id));
			const res = await fetch(`/api/beans/${id}`, { method: 'DELETE' });
			if (!res.ok) {
				const data: Bean[] = await (await fetch('/api/beans')).json();
				set(data);
				throw new Error('Failed to delete bean');
			}
		},

		async toggleFav(id: string) {
			// Optimistic update for instant UI response
			update((list) => list.map((b) => (b.id === id ? { ...b, favorited: !b.favorited } : b)));
			const res = await fetch(`/api/beans/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'toggleFav' })
			});
			if (res.ok) {
				const updated: Bean = await res.json();
				update((list) => list.map((b) => (b.id === id ? updated : b)));
			}
		},

		async updateBean(id: string, data: Partial<Omit<Bean, 'id'>>): Promise<Bean> {
			const res = await fetch(`/api/beans/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (!res.ok) throw new Error('Failed to update bean');
			const updated: Bean = await res.json();
			update((list) => list.map((b) => (b.id === id ? updated : b)));
			return updated;
		},

		async reset() {
			const res = await fetch('/api/beans', { method: 'DELETE' });
			if (res.ok) {
				const data: Bean[] = await res.json();
				set(data);
			}
		}
	};
}

export const beans = createBeansStore();
