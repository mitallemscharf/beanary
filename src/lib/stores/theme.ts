import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const KEY = 'beanery-theme';

const initial = browser ? localStorage.getItem(KEY) === 'dark' : false;

export const darkMode = writable<boolean>(initial);

darkMode.subscribe((val) => {
	if (!browser) return;
	localStorage.setItem(KEY, val ? 'dark' : 'light');
	document.documentElement.classList.toggle('dark', val);
});
