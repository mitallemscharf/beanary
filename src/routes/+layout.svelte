<script lang="ts">
	import './layout.css';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { darkMode } from '$lib/stores/theme';
	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(() => {});
		}
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}
<Toast />
