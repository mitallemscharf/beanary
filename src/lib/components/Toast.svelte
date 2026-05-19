<script lang="ts">
	import { toast } from '$lib/stores/toast';
</script>

{#if $toast}
	{#key $toast.id}
		<div
			class="fixed bottom-20 left-1/2 z-[500] -translate-x-1/2 md:bottom-8"
			style="animation: toastIn 0.35s cubic-bezier(0.22,1,0.36,1)"
		>
			<div class="flex items-center gap-3 rounded-full bg-[#1B1C19] px-5 py-3 shadow-xl">
				<span class="material-symbols-outlined text-crema-gold text-[17px]">{$toast.icon}</span>
				<p class="text-label-sm whitespace-nowrap text-white">{$toast.message}</p>
			</div>
		</div>
	{/key}
{/if}

<style>
	@keyframes toastIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(10px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0) scale(1);
		}
	}
</style>
