import { writable } from 'svelte/store';

interface Toast {
	id: number;
	message: string;
	icon: string;
}

let timer: ReturnType<typeof setTimeout>;
const { subscribe, set } = writable<Toast | null>(null);

export const toast = { subscribe };

export function showToast(message: string, icon = 'info') {
	clearTimeout(timer);
	set({ id: Date.now(), message, icon });
	timer = setTimeout(() => set(null), 3200);
}
