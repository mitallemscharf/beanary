<script lang="ts">
	interface Props {
		open: boolean;
		title?: string;
		message: string;
		confirmLabel?: string;
		danger?: boolean;
		onconfirm: () => void;
		oncancel: () => void;
	}

	const {
		open,
		title = 'Are you sure?',
		message,
		confirmLabel = 'Delete',
		danger = true,
		onconfirm,
		oncancel
	}: Props = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[3px]"
		onclick={oncancel}
		onkeydown={(e) => e.key === 'Escape' && oncancel()}
		style="animation: backdropIn 0.18s ease-out"
	></div>

	<div class="pointer-events-none fixed inset-0 z-[151] flex items-center justify-center p-4">
		<div
			class="pointer-events-auto w-full max-w-sm rounded-2xl border border-outline-variant/15 bg-surface p-8 shadow-2xl"
			style="animation: modalIn 0.22s cubic-bezier(0.22,1,0.36,1)"
		>
			<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-full {danger ? 'bg-error/8' : 'bg-crema-gold/10'}">
				<span
					class="material-symbols-outlined text-[22px] {danger ? 'text-error' : 'text-crema-gold'}"
					style="font-variation-settings: 'FILL' 1, 'wght' 300"
				>{danger ? 'delete_forever' : 'help'}</span>
			</div>

			<h3 class="text-headline-md mb-2">{title}</h3>
			<p class="text-body-md mb-8 text-on-surface-variant">{message}</p>

			<div class="flex gap-3">
				<button
					onclick={oncancel}
					class="text-label-sm flex-1 rounded-full border border-outline-variant/40 py-3 text-on-surface-variant uppercase tracking-widest transition-all hover:bg-surface-container-high active:scale-95"
				>
					Cancel
				</button>
				<button
					onclick={onconfirm}
					class="text-label-sm flex-1 rounded-full py-3 uppercase tracking-widest transition-all active:scale-95 {danger
						? 'bg-error text-white hover:opacity-90'
						: 'bg-crema-gold text-white hover:brightness-110'}"
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	</div>
{/if}
