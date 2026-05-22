<script lang="ts">
	let { onComplete }: { onComplete: () => void } = $props();

	let slide = $state(0);

	const SLIDES = [
		{
			icon: 'coffee',
			title: 'Welcome to Beanery',
			subtitle: 'Your personal coffee diary',
			body: 'Track every espresso shot you brew — dose, yield, time, and taste notes. Build a precise picture of your extractions over time.',
			color: '#C5A059'
		},
		{
			icon: 'scale',
			title: 'What is Dose?',
			subtitle: 'The coffee you put in',
			body: 'Dose is the amount of ground coffee you add to the portafilter, measured in grams. A typical espresso uses 18–20g. More dose → stronger, richer flavour.',
			color: '#735c00'
		},
		{
			icon: 'water_drop',
			title: 'What is Yield?',
			subtitle: 'The espresso that comes out',
			body: 'Yield is the weight of liquid espresso in your cup, measured in grams. A typical espresso yields 36–40g. More yield → lighter, more diluted flavour.',
			color: '#2c6e9c'
		},
		{
			icon: 'calculate',
			title: 'What is Brew Ratio?',
			subtitle: 'The magic number',
			body: 'Brew Ratio = Yield ÷ Dose. A 1:2 ratio means 18g in → 36g out. This is the single most important number for espresso. Beanery calculates it live as you type.',
			color: '#2C1A0E'
		}
	];

	const current = $derived(SLIDES[slide]);
	const isLast = $derived(slide === SLIDES.length - 1);

	function next() {
		if (isLast) { onComplete(); } else { slide++; }
	}
</script>

<!-- Backdrop -->
<div class="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm" style="animation: fadeIn 0.3s ease-out"></div>

<!-- Modal -->
<div class="fixed inset-x-4 top-1/2 z-[501] max-w-md -translate-y-1/2 rounded-2xl bg-surface shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
	style="animation: slideUp 0.35s cubic-bezier(0.22,1,0.36,1)">

	<!-- Progress dots -->
	<div class="flex items-center justify-center gap-2 pt-6">
		{#each SLIDES as _, i}
			<div class="rounded-full transition-all duration-300 {i === slide ? 'w-6 h-2 bg-crema-gold' : 'w-2 h-2 bg-outline-variant/40'}"></div>
		{/each}
	</div>

	<!-- Content -->
	<div class="px-8 py-6 text-center">
		<!-- Icon -->
		<div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300"
			style="background-color: {current.color}20; border: 1.5px solid {current.color}40">
			<span class="material-symbols-outlined text-[40px]" style="color: {current.color}; font-variation-settings: 'FILL' 1">{current.icon}</span>
		</div>

		<p class="text-label-caps mb-1" style="color: {current.color}">{current.subtitle}</p>
		<h2 class="font-display text-[26px] font-bold text-primary leading-tight mb-3">{current.title}</h2>
		<p class="text-body-md text-on-surface-variant leading-relaxed">{current.body}</p>
	</div>

	<!-- Buttons -->
	<div class="flex gap-3 px-8 pb-8">
		{#if slide > 0}
			<button
				onclick={() => slide--}
				class="flex items-center justify-center gap-2 rounded-full border border-outline-variant/30 px-5 py-3 text-on-surface-variant transition-all hover:border-crema-gold/40 active:scale-95">
				<span class="material-symbols-outlined text-[18px]">arrow_back</span>
			</button>
		{/if}
		<button
			onclick={next}
			class="text-label-caps flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 active:scale-95"
			style="background-color: {current.color}">
			{#if isLast}
				<span class="material-symbols-outlined text-[18px]">rocket_launch</span>
				Start Brewing
			{:else}
				Next
				<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
			{/if}
		</button>
	</div>
</div>

<style>
	@keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
	@keyframes slideUp {
		from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 16px)) scale(0.96); }
		to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
	}
</style>
