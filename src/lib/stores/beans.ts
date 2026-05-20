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
	roastDate?: string;
	img: string;
	favorited: boolean;
}

export type FreshnessInfo = {
	label: 'Too Fresh' | 'Fresh' | 'Peak' | 'Past Peak' | 'Old';
	daysAgo: number | null;
	color: string;
	icon: string;
};

export function getFreshness(roastDate?: string, fallbackStatus?: string): FreshnessInfo {
	if (!roastDate) {
		const label = (fallbackStatus as FreshnessInfo['label']) ?? 'Fresh';
		return { label, daysAgo: null, color: freshnessColor(label), icon: freshnessIcon(label) };
	}
	const days = Math.floor((Date.now() - new Date(roastDate).getTime()) / 86_400_000);
	if (days < 0)   return { label: 'Too Fresh', daysAgo: 0, color: '#6B7280', icon: 'hourglass_empty' };
	if (days <= 7)  return { label: 'Too Fresh', daysAgo: days, color: '#6B7280', icon: 'hourglass_empty' };
	if (days <= 21) return { label: 'Fresh',     daysAgo: days, color: '#16A34A', icon: 'check_circle' };
	if (days <= 35) return { label: 'Peak',      daysAgo: days, color: '#C5A059', icon: 'star' };
	if (days <= 60) return { label: 'Past Peak', daysAgo: days, color: '#D97706', icon: 'warning' };
	return              { label: 'Old',       daysAgo: days, color: '#DC2626', icon: 'cancel' };
}

function freshnessColor(label: string): string {
	if (label === 'Fresh') return '#16A34A';
	if (label === 'Peak') return '#C5A059';
	if (label === 'Past Peak') return '#D97706';
	return '#6B7280';
}

function freshnessIcon(label: string): string {
	if (label === 'Fresh') return 'check_circle';
	if (label === 'Peak') return 'star';
	if (label === 'Past Peak') return 'warning';
	return 'hourglass_empty';
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
