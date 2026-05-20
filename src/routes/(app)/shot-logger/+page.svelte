<script lang="ts">
	import { shots } from '$lib/stores/shots';
	import { beans } from '$lib/stores/beans';
	import { reveal } from '$lib/actions/reveal';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/stores/toast';
	import { onDestroy } from 'svelte';

	// ── Extraction Timer ──
	let timerSeconds = $state(0);
	let timerRunning = $state(false);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	const timerDisplay = $derived(
		String(Math.floor(timerSeconds / 60)).padStart(2, '0') + ':' + String(timerSeconds % 60).padStart(2, '0')
	);

	function startTimer() {
		if (timerRunning) return;
		timerRunning = true;
		timerInterval = setInterval(() => { timerSeconds += 1; }, 1000);
	}

	function stopTimer() {
		if (!timerRunning && timerSeconds === 0) return;
		timerRunning = false;
		if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
		if (timerSeconds > 0) { time = timerSeconds; }
	}

	function resetTimer() {
		timerRunning = false;
		if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
		timerSeconds = 0;
	}

	onDestroy(() => { if (timerInterval) clearInterval(timerInterval); });

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
	let saving = $state(false);
	let validationError = $state('');

	const ratio = $derived(dose > 0 ? (yieldG / dose).toFixed(1) : '0.0');
	const ratioNum = $derived(dose > 0 ? yieldG / dose : 0);

	// SVG circle: circumference = 2π × 88 ≈ 552.9
	const circumference = 552.9;
	const dashOffset = $derived(
		Math.max(0, Math.min(circumference, circumference - ((ratioNum - 1) / 2) * circumference))
	);
	const ratioLabel = $derived(
		ratioNum < 1.5 ? 'Ristretto' : ratioNum < 2.2 ? 'Balanced' : 'Lungo'
	);

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
			goto('/history');
		} catch {
			showToast('Failed to save shot — check your connection', 'error');
			saving = false;
		}
	}


</script>

<svelte:head>
	<title>Shot Logger | Beanery</title>
</svelte:head>


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
						<label for="bean-select" class="text-label-sm mb-1 block text-on-surface-variant uppercase">Single Origin / Blend</label>
						<p class="text-label-caps mb-2 text-on-surface-variant/40">The coffee you're extracting — select from your library</p>
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
							<label class="text-label-sm mb-1 block text-on-surface-variant uppercase" for="dose">Dose (g)</label>
							<p class="text-label-caps mb-2 text-on-surface-variant/40">Grams of ground coffee in the portafilter — typically 14–20g</p>
							<div class="flex overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-bright transition-colors duration-200 focus-within:ring-2 focus-within:ring-crema-gold/60 hover:border-crema-gold/50">
								<button type="button" onclick={() => dose = Math.max(1, Math.round((dose - 0.1) * 10) / 10)}
									class="flex-shrink-0 px-3.5 text-on-surface-variant/60 text-lg hover:text-crema-gold hover:bg-surface-container-low active:bg-surface-container-high transition-colors">−</button>
								<input id="dose" type="number" step="0.1" bind:value={dose}
									class="text-body-md flex-1 bg-transparent p-3.5 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
								<button type="button" onclick={() => dose = Math.round((dose + 0.1) * 10) / 10}
									class="flex-shrink-0 px-3.5 text-on-surface-variant/60 text-lg hover:text-crema-gold hover:bg-surface-container-low active:bg-surface-container-high transition-colors">+</button>
							</div>
						</div>

						<!-- Grind -->
						<div>
							<label for="grind" class="text-label-sm mb-1 block text-on-surface-variant uppercase">Grind Size</label>
							<p class="text-label-caps mb-2 text-on-surface-variant/40">Your grinder setting — finer = slower flow, coarser = faster</p>
							<div class="relative">
								<input
									id="grind"
									type="text"
									bind:value={grind}
									placeholder="e.g. 2.4 or 14 clicks"
									class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 pr-12 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
								/>
								<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 transition-colors hover:text-crema-gold" style="cursor:pointer">tune</span>
							</div>
						</div>

						<!-- Yield -->
						<div>
							<label class="text-label-sm mb-1 block text-on-surface-variant uppercase" for="yield">Yield (g)</label>
							<p class="text-label-caps mb-2 text-on-surface-variant/40">Total weight of espresso in your cup — the liquid output</p>
							<div class="flex overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-bright transition-colors duration-200 focus-within:ring-2 focus-within:ring-crema-gold/60 hover:border-crema-gold/50">
								<button type="button" onclick={() => yieldG = Math.max(1, Math.round((yieldG - 0.5) * 10) / 10)}
									class="flex-shrink-0 px-3.5 text-on-surface-variant/60 text-lg hover:text-crema-gold hover:bg-surface-container-low active:bg-surface-container-high transition-colors">−</button>
								<input id="yield" type="number" step="0.1" bind:value={yieldG}
									class="text-body-md flex-1 bg-transparent p-3.5 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
								<button type="button" onclick={() => yieldG = Math.round((yieldG + 0.5) * 10) / 10}
									class="flex-shrink-0 px-3.5 text-on-surface-variant/60 text-lg hover:text-crema-gold hover:bg-surface-container-low active:bg-surface-container-high transition-colors">+</button>
							</div>
						</div>

						<!-- Time -->
						<div>
							<label for="time" class="text-label-sm mb-1 block text-on-surface-variant uppercase">Time (s)</label>
							<p class="text-label-caps mb-2 text-on-surface-variant/40">Extraction duration in seconds — aim for 25–35s for espresso</p>
							<div class="flex overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-bright transition-colors duration-200 focus-within:ring-2 focus-within:ring-crema-gold/60 hover:border-crema-gold/50">
								<button type="button" onclick={() => time = Math.max(1, time - 1)}
									class="flex-shrink-0 px-3.5 text-on-surface-variant/60 text-lg hover:text-crema-gold hover:bg-surface-container-low active:bg-surface-container-high transition-colors">−</button>
								<input id="time" type="number" bind:value={time}
									class="text-body-md flex-1 bg-transparent p-3.5 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
								<button type="button" onclick={() => time = time + 1}
									class="flex-shrink-0 px-3.5 text-on-surface-variant/60 text-lg hover:text-crema-gold hover:bg-surface-container-low active:bg-surface-container-high transition-colors">+</button>
							</div>
						</div>
					</div>

					<!-- Temperature slider -->
					<div>
						<label for="temp-range" class="text-label-sm mb-1 block text-on-surface-variant uppercase">Water Temperature</label>
						<p class="text-label-caps mb-3 text-on-surface-variant/40">Brew water temp — lighter roasts prefer 93–96°C, darker roasts 88–92°C</p>
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
						<label for="notes" class="text-label-sm mb-1 block text-on-surface-variant uppercase">Sensory Notes</label>
						<p class="text-label-caps mb-2 text-on-surface-variant/40">Your impressions — aroma, acidity, sweetness, mouthfeel, finish</p>
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

				<!-- ── Extraction Timer ── -->
				<div class="rounded-xl border border-primary/5 bg-surface-bright p-8 shadow-sm">
					<p class="text-label-sm mb-6 block text-center text-on-surface-variant uppercase tracking-widest">Extraction Timer</p>

					<!-- Timer display -->
					<div class="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
						<!-- Outer pulse ring (only visible when running) -->
						<div class="absolute inset-0 rounded-full border-2 border-crema-gold/30 {timerRunning ? 'timer-pulse' : ''}"></div>
						<div class="absolute inset-3 rounded-full border border-crema-gold/15 {timerRunning ? 'timer-pulse-inner' : ''}"></div>
						<!-- Number display -->
						<div class="relative z-10 flex flex-col items-center">
							<span
								class="font-mono text-[52px] font-bold leading-none tracking-tight transition-colors duration-300 {timerRunning ? 'text-crema-gold' : timerSeconds > 0 ? 'text-primary' : 'text-on-surface-variant/30'}"
							>{timerDisplay}</span>
							<span class="text-label-caps mt-1.5 {timerRunning ? 'text-crema-gold' : 'text-on-surface-variant/40'}">
								{timerRunning ? 'Running…' : timerSeconds > 0 ? `${timerSeconds}s recorded` : 'Ready'}
							</span>
						</div>
					</div>

					<!-- Controls -->
					<div class="flex gap-2">
						<button
							type="button"
							onclick={startTimer}
							disabled={timerRunning}
							class="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-label-caps uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed {timerRunning ? 'bg-surface-container-high text-on-surface-variant' : 'bg-green-500/10 text-green-700 hover:bg-green-500/20'}"
						>
							<span class="material-symbols-outlined text-[18px]">play_arrow</span>
							Start
						</button>
						<button
							type="button"
							onclick={stopTimer}
							disabled={!timerRunning}
							class="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-label-caps uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-error/10 text-error hover:bg-error/20"
						>
							<span class="material-symbols-outlined text-[18px]">stop</span>
							Stop
						</button>
						<button
							type="button"
							onclick={resetTimer}
							class="flex items-center justify-center rounded-full px-4 py-3 text-label-caps text-on-surface-variant/50 transition-all duration-200 hover:bg-surface-container-high hover:text-on-surface active:scale-95"
							aria-label="Reset timer"
						>
							<span class="material-symbols-outlined text-[18px]">restart_alt</span>
						</button>
					</div>

					<p class="mt-4 text-center text-label-caps text-on-surface-variant/40">Stop auto-fills the time field</p>
				</div>

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
								stroke-dashoffset={dashOffset}
								style="transition: stroke-dashoffset 0.5s ease"
							/>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<span class="text-label-caps text-on-surface-variant/50 mb-1">Current</span>
							<span class="text-headline-lg text-primary font-display">1:{ratio}</span>
							<span class="text-label-caps mt-1 text-crema-gold">{ratioLabel}</span>
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
	@keyframes timerPulse {
		0%, 100% { opacity: 0.3; transform: scale(1); }
		50%       { opacity: 0.7; transform: scale(1.04); }
	}
	@keyframes timerPulseInner {
		0%, 100% { opacity: 0.2; transform: scale(1); }
		50%       { opacity: 0.5; transform: scale(1.07); }
	}
	.timer-pulse       { animation: timerPulse 1.8s ease-in-out infinite; }
	.timer-pulse-inner { animation: timerPulseInner 1.8s ease-in-out infinite 0.3s; }
</style>
