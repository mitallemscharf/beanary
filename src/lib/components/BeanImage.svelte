<script lang="ts">
	interface Props {
		src?: string;
		alt: string;
		class?: string;
	}
	let { src = '', alt, class: className = '' }: Props = $props();
	let failed = $state(false);
	const initial = $derived(alt ? alt[0].toUpperCase() : '?');
</script>

{#if src && !failed}
	<img {src} {alt} class={className} onerror={() => (failed = true)} />
{:else}
	<div class="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#FAF8F5]">
		<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" aria-hidden="true">
			<ellipse cx="20" cy="20" rx="13" ry="9" fill="#C5A059" opacity="0.15"/>
			<ellipse cx="20" cy="20" rx="13" ry="9" fill="none" stroke="#C5A059" stroke-width="1.5"/>
			<path d="M7.2 20 Q20 13 32.8 20" stroke="#C5A059" stroke-width="1.5" fill="none" stroke-linecap="round"/>
		</svg>
		<span class="font-display text-2xl font-bold leading-none text-[#C5A059]">{initial}</span>
	</div>
{/if}
