<script lang="ts">
	import './layout.css';
	import { onNavigate } from '$app/navigation';
	import Toast from '$lib/components/Toast.svelte';
	import { darkMode } from '$lib/stores/theme';
	let { children } = $props();

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
