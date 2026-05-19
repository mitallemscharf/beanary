import { writable } from 'svelte/store';

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

function createShotsStore() {
	const { subscribe, set, update } = writable<Shot[]>([]);

	return {
		subscribe,

		async load() {
			const res = await fetch('/api/shots');
			if (res.ok) {
				const data: Shot[] = await res.json();
				set(data);
			}
		},

		async add(shotData: Omit<Shot, 'id'>): Promise<Shot> {
			const res = await fetch('/api/shots', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(shotData)
			});
			if (!res.ok) throw new Error('Failed to save shot');
			const saved: Shot = await res.json();
			update((shots) => [saved, ...shots]);
			return saved;
		},

		async remove(id: string) {
			// Optimistic update
			update((shots) => shots.filter((s) => s.id !== id));
			const res = await fetch(`/api/shots/${id}`, { method: 'DELETE' });
			if (!res.ok) {
				// Revert by reloading
				const data: Shot[] = await (await fetch('/api/shots')).json();
				set(data);
				throw new Error('Failed to delete shot');
			}
		},

		async reset() {
			const res = await fetch('/api/shots', { method: 'DELETE' });
			if (res.ok) {
				const data: Shot[] = await res.json();
				set(data);
			}
		}
	};
}

export const shots = createShotsStore();
