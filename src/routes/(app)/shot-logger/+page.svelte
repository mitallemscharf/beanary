<script lang="ts">
	import { shots } from '$lib/stores/shots';
	import { beans } from '$lib/stores/beans';
	import { reveal } from '$lib/actions/reveal';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/stores/toast';

	// Bean dropdown — live from the beans store (includes any newly added beans)
	const beanOptions = $derived($beans);

	let bean = $state($beans[0]?.name ?? '');
	$effect(() => {
		// Keep selection valid if the store changes and current value is gone
		if (bean === '' && $beans.length > 0) bean = $beans[0].name;
	});

	let dose = $state(18);
	let yieldG = $state(36);
	let time = $state(30);
	let temp = $state(94);
	let grind = $state('');
	let notes = $state('');
	let rating = $state(4);
	let showSuccess = $state(false);
	let saving = $state(false);
	let validationError = $state('');

	const ratio = $derived(dose > 0 ? (yieldG / dose).toFixed(1) : '0.0');
	const ratioNum = $derived(dose > 0 ? yieldG / dose : 0);

	// SVG circle: circumference = 2π × 88 ≈ 552.9
	const circumference = 552.9;
	const dashOffset = $derived(() => {
		const progress = ((ratioNum - 1) / 2) * circumference;
		return Math.max(0, Math.min(circumference, circumference - progress));
	});

	const ratioLabel = $derived(() => {
		if (ratioNum < 1.5) return 'Ristretto';
		if (ratioNum < 2.2) return 'Balanced';
		return 'Lungo';
	});

	async function handleSave() {
		validationError = '';
		if (!bean) {
			validationError = 'Please select a bean from your library first.';
			return;
		}
		if (!dose || dose <= 0) {
			validationError = 'Dose must be greater than 0g.';
			return;
		}
		if (!yieldG || yieldG <= 0) {
			validationError = 'Yield must be greater than 0g.';
			return;
		}
		if (!time || time <= 0) {
			validationError = 'Extraction time must be greater than 0s.';
			return;
		}

		saving = true;
		try {
			const selectedBean = $beans.find((b) => b.name === bean);
			await shots.add({
				bean,
				dose,
				yield: yieldG,
				time,
				temp,
				grind,
				notes,
				rating,
				date: 'Today',
				process: 'Washed',
				roast: 'Light Roast',
				img: selectedBean?.img ?? 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=200&h=200&auto=format&fit=crop&q=80'
			});
			showToast('Shot recorded in your journal', 'check_circle');
			showSuccess = true;
		} catch {
			showToast('Failed to save shot — check your connection', 'error');
			saving = false;
		}
	}

	function logAnother() {
		showSuccess = false;
		saving = false;
		// Reset form to defaults
		bean = $beans[0]?.name ?? '';
		dose = 18;
		yieldG = 36;
		time = 30;
		temp = 94;
		grind = '';
		notes = '';
		rating = 4;
		validationError = '';
	}
</script>

<svelte:head>
	<title>Shot Logger | Beanery</title>
</svelte:head>

<!-- Success overlay -->
{#if showSuccess}
	<div
		class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface/96 backdrop-blur-md"
		style="animation: fadeIn 0.35s ease-out"
	>
		<div class="flex h-20 w-20 items-center justify-center rounded-full bg-crema-gold/10 mb-6 ring-1 ring-crema-gold/20">
			<span class="material-symbols-outlined text-crema-gold text-[44px]" style="font-variation-settings: 'FILL' 1, 'wght' 300">check_circle</span>
		</div>
		<h2 class="text-headline-lg mb-2">Extraction Recorded</h2>
		<p class="text-body-md text-on-surface-variant mb-10">Saved to your journal. What's next?</p>
		<div class="flex flex-col items-center gap-3 sm:flex-row">
			<button
				onclick={logAnother}
				class="text-label-caps rounded-full border border-outline-variant/40 px-8 py-3.5 uppercase tracking-widest text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface active:scale-95"
			>
				<span class="material-symbols-outlined mr-2 text-[16px]">add</span>Log Another Shot
			</button>
			<a
				href="/history"
				class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
			>
				<span class="material-symbols-outlined mr-2 text-[16px]">menu_book</span>View Journal
			</a>
		</div>
	</div>
{/if}

<div class="px-container-padding pb-24 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">
		<!-- Page Header -->
		<header class="mb-12" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Extraction Laboratory</p>
			<h1 class="text-headline-xl mb-3">Shot Logger</h1>
			<p class="text-body-lg max-w-2xl text-on-surface-variant">
				Capture the nuance of your morning ritual. Precise variables yield predictable excellence.
			</p>
		</header>

		<!-- Main grid -->
		<div class="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">

			<!-- ── Form (7 cols) ── -->
			<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8 shadow-sm lg:col-span-7" use:reveal={0}>
				<form class="space-y-stack-lg" onsubmit={(e) => e.preventDefault()}>

					<!-- Bean select -->
					<div>
						<label for="bean-select" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Single Origin / Blend</label>
						<select
							id="bean-select"
							bind:value={bean}
							class="text-body-md w-full cursor-pointer rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
						>
							{#each beanOptions as b (b.id)}
								<option value={b.name}>{b.name} · {b.origin}</option>
							{/each}
							{#if beanOptions.length === 0}
								<option value="" disabled>No beans in library — add one first</option>
							{/if}
						</select>
					</div>

					<div class="grid grid-cols-1 gap-stack-lg md:grid-cols-2">
						<!-- Dose -->
						<div>
							<label class="text-label-sm mb-2 block text-on-surface-variant uppercase" for="dose">Dose (g)</label>
							<input
								id="dose"
								type="number"
								step="0.1"
								bind:value={dose}
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
							/>
						</div>

						<!-- Grind -->
						<div>
							<label for="grind" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Grind Size</label>
							<div class="relative">
								<input
									id="grind"
									type="text"
									bind:value={grind}
									placeholder="e.g. 2.4 / 14 clicks"
									class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 pr-12 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
								/>
								<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 transition-colors hover:text-crema-gold" style="cursor:pointer">tune</span>
							</div>
						</div>

						<!-- Yield -->
						<div>
							<label class="text-label-sm mb-2 block text-on-surface-variant uppercase" for="yield">Yield (g)</label>
							<input
								id="yield"
								type="number"
								step="0.1"
								bind:value={yieldG}
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
							/>
						</div>

						<!-- Time -->
						<div>
							<label for="time" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Time (s)</label>
							<input
								id="time"
								type="number"
								bind:value={time}
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
							/>
						</div>
					</div>

					<!-- Temperature slider -->
					<div>
						<label for="temp-range" class="text-label-sm mb-3 block text-on-surface-variant uppercase">Water Temperature</label>
						<div class="flex items-center gap-5">
							<input
								id="temp-range"
								type="range"
								min="85"
								max="100"
								bind:value={temp}
								class="range-gold flex-1"
							/>
							<div class="w-16 text-right">
								<span class="text-headline-md text-crema-gold">{temp}°C</span>
							</div>
						</div>
						<div class="mt-2 flex justify-between">
							<span class="text-label-caps text-on-surface-variant/40">85°C Cool</span>
							<span class="text-label-caps text-on-surface-variant/40">100°C Hot</span>
						</div>
					</div>

					<!-- Sensory notes -->
					<div class="border-t border-outline-variant/10 pt-6">
						<label for="notes" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Sensory Notes</label>
						<textarea
							id="notes"
							bind:value={notes}
							rows={3}
							placeholder="Describe the mouthfeel, acidity, and aromatic finish..."
							class="text-body-md w-full resize-none rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
						></textarea>
					</div>

					<!-- Star Rating -->
					<div class="border-t border-outline-variant/10 pt-6">
						<p class="text-label-sm mb-3 block text-on-surface-variant uppercase">Shot Rating</p>
						<div class="flex items-center gap-2">
							<button type="button" onclick={() => (rating = 1)} class="transition-transform hover:scale-125 active:scale-95" aria-label="1 star">
								<span class="material-symbols-outlined text-[28px]" class:text-crema-gold={rating >= 1} class:text-outline-variant={rating < 1} style="font-variation-settings: 'FILL' {rating >= 1 ? 1 : 0}, 'wght' 300">star</span>
							</button>
							<button type="button" onclick={() => (rating = 2)} class="transition-transform hover:scale-125 active:scale-95" aria-label="2 stars">
								<span class="material-symbols-outlined text-[28px]" class:text-crema-gold={rating >= 2} class:text-outline-variant={rating < 2} style="font-variation-settings: 'FILL' {rating >= 2 ? 1 : 0}, 'wght' 300">star</span>
							</button>
							<button type="button" onclick={() => (rating = 3)} class="transition-transform hover:scale-125 active:scale-95" aria-label="3 stars">
								<span class="material-symbols-outlined text-[28px]" class:text-crema-gold={rating >= 3} class:text-outline-variant={rating < 3} style="font-variation-settings: 'FILL' {rating >= 3 ? 1 : 0}, 'wght' 300">star</span>
							</button>
							<button type="button" onclick={() => (rating = 4)} class="transition-transform hover:scale-125 active:scale-95" aria-label="4 stars">
								<span class="material-symbols-outlined text-[28px]" class:text-crema-gold={rating >= 4} class:text-outline-variant={rating < 4} style="font-variation-settings: 'FILL' {rating >= 4 ? 1 : 0}, 'wght' 300">star</span>
							</button>
							<button type="button" onclick={() => (rating = 5)} class="transition-transform hover:scale-125 active:scale-95" aria-label="5 stars">
								<span class="material-symbols-outlined text-[28px]" class:text-crema-gold={rating >= 5} class:text-outline-variant={rating < 5} style="font-variation-settings: 'FILL' {rating >= 5 ? 1 : 0}, 'wght' 300">star</span>
							</button>
							<span class="text-label-caps ml-2 text-on-surface-variant/60">
								{['', 'Poor', 'Fair', 'Good', 'Great', 'Perfect'][rating]}
							</span>
						</div>
					</div>

					<!-- Validation error -->
					{#if validationError}
						<div class="flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
							<span class="material-symbols-outlined text-error text-[18px]">error</span>
							<p class="text-label-sm text-error">{validationError}</p>
						</div>
					{/if}

					<!-- Save button -->
					<button
						type="button"
						onclick={handleSave}
						disabled={saving}
						class="text-label-caps flex w-full items-center justify-center gap-2.5 rounded-full bg-crema-gold py-5 text-white uppercase tracking-widest shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{#if saving}
							<span class="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
							Saving to Database…
						{:else}
							<span class="material-symbols-outlined text-[20px]">archive</span>
							Record Shot to Journal
						{/if}
					</button>
				</form>
			</div>

			<!-- ── Analysis visuals (5 cols) ── -->
			<div class="space-y-gutter lg:col-span-5" use:reveal={150}>

				<!-- Live Brew Ratio gauge -->
				<div class="group flex flex-col items-center rounded-xl border border-primary/5 bg-surface-bright p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
					<p class="text-label-sm mb-7 block text-on-surface-variant uppercase tracking-widest transition-colors group-hover:text-crema-gold">Live Brew Ratio</p>

					<div class="relative h-48 w-48 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
						<svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 196 196">
							<circle cx="98" cy="98" r="88" fill="none" stroke="currentColor" stroke-width="4" class="text-surface-container-high" />
							<circle
								cx="98" cy="98" r="88"
								fill="none"
								stroke="#C5A059"
								stroke-width="4"
								stroke-linecap="round"
								stroke-dasharray={circumference}
								stroke-dashoffset={dashOffset()}
								style="transition: stroke-dashoffset 0.5s ease"
							/>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<span class="text-label-caps text-on-surface-variant/50 mb-1">Current</span>
							<span class="text-headline-lg text-primary font-display">1:{ratio}</span>
							<span class="text-label-caps mt-1 text-crema-gold">{ratioLabel()}</span>
						</div>
					</div>

					<div class="mt-7 grid w-full grid-cols-3 gap-1 text-center">
						<span class="text-label-caps text-on-surface-variant/40 transition-colors hover:text-on-surface cursor-pointer">Ristretto</span>
						<span class="text-label-caps text-crema-gold">Normale</span>
						<span class="text-label-caps text-on-surface-variant/40 transition-colors hover:text-on-surface cursor-pointer">Lungo</span>
					</div>
				</div>

				<!-- Flavor Profile card -->
				<div class="rounded-xl border border-primary/5 bg-surface-bright p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
					<div class="mb-6 flex items-center justify-between">
						<p class="text-label-sm text-on-surface-variant uppercase tracking-widest">Flavor Profile</p>
						<button class="rounded-full p-1 transition-all hover:bg-surface-container-high active:scale-95">
							<span class="material-symbols-outlined text-crema-gold text-[20px]">insights</span>
						</button>
					</div>

					<!-- Radar chart -->
					<div class="relative flex aspect-square w-full cursor-crosshair items-center justify-center rounded-full border border-dashed border-outline-variant/30 bg-surface-container-low/30">
						<div class="absolute inset-4 rounded-full border border-outline-variant/10 hover:border-crema-gold/25 transition-colors"></div>
						<div class="absolute inset-12 rounded-full border border-outline-variant/10 hover:border-crema-gold/25 transition-colors"></div>
						<div class="absolute inset-20 rounded-full border border-outline-variant/10 hover:border-crema-gold/25 transition-colors"></div>
						<div class="spider-chart absolute inset-7 border border-crema-gold/80 bg-crema-gold/10 transition-all duration-500 hover:scale-105 hover:bg-crema-gold/20"></div>
						<span class="absolute top-2 text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest hover:text-crema-gold transition-colors cursor-pointer">Acidity</span>
						<span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest hover:text-crema-gold transition-colors cursor-pointer">Body</span>
						<span class="absolute bottom-2 text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest hover:text-crema-gold transition-colors cursor-pointer">Sweet</span>
						<span class="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest hover:text-crema-gold transition-colors cursor-pointer">Floral</span>
					</div>

					<!-- Flavor tags -->
					<div class="mt-5 flex flex-wrap gap-2">
						{#each ['Bergamot', 'Jasmine', 'Milk Chocolate', 'Citrus', 'Caramel'] as tag}
							<span class="cursor-pointer rounded-full bg-surface-container-high px-3 py-1 text-[11px] text-on-surface-variant transition-all duration-200 hover:bg-crema-gold hover:text-white">
								{tag}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
