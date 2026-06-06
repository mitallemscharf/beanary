<script lang="ts">
	import { shots } from '$lib/stores/shots';
	import { beans } from '$lib/stores/beans';
	import { reveal } from '$lib/actions/reveal';
	import { goto } from '$app/navigation';
	import BeanImage from '$lib/components/BeanImage.svelte';

	// ── Real counts from stores ──
	const totalShots = $derived($shots.length);
	const todayCount = $derived($shots.filter((s) => s.date === 'Today').length);

	const avgRating = $derived(
		$shots.length > 0
			? ($shots.reduce((a, s) => a + s.rating, 0) / $shots.length).toFixed(1)
			: '—'
	);

	// Bean with the highest average rating across all logged shots
	const bestBean = $derived(() => {
		if ($shots.length === 0) return '—';
		const acc: Record<string, { sum: number; n: number }> = {};
		for (const s of $shots) {
			if (!acc[s.bean]) acc[s.bean] = { sum: 0, n: 0 };
			acc[s.bean].sum += s.rating;
			acc[s.bean].n++;
		}
		return Object.entries(acc).sort((a, b) => b[1].sum / b[1].n - a[1].sum / a[1].n)[0][0];
	});

	// Active bags = beans that are Fresh or Peak in the library
	const activeBags = $derived($beans.filter((b) => b.status !== 'Past Peak').length);

	function stars(n: number) {
		return Array.from({ length: 5 }, (_, i) => i < n);
	}

	// Chart bars — one bar per shot, height from rating
	const maxRating = $derived(Math.max(...$shots.map((s) => s.rating), 1));
	const bars = $derived(
		[...$shots].reverse().map((shot) => ({
			h: Math.round((shot.rating / 5) * 100),
			label:
				shot.date === 'Today'
					? 'Today'
					: shot.date === 'Yesterday'
						? 'Yest.'
						: shot.date.split(',')[0].split(' ').slice(0, 2).join(' '),
			tooltip: `${shot.bean.split(' ')[0]} · 1:${(shot.yield / shot.dose).toFixed(1)} · ★${shot.rating}`,
			peak: shot.rating === maxRating
		}))
	);

	// Recent Rituals — last 3 shots from store (real data)
	const recentRituals = $derived(
		$shots.slice(0, 3).map((s) => ({
			id: s.id,
			name: s.bean,
			method: `Espresso · ${s.dose}g → ${s.yield}g`,
			time: `${s.time}s`,
			ratio: `1:${(s.yield / s.dose).toFixed(1)}`,
			rating: s.rating,
			img: s.img,
			date: s.date
		}))
	);

	const statCards = $derived([
		{
			label: 'Total Shots',
			value: totalShots.toLocaleString(),
			sub: todayCount > 0 ? `+${todayCount} today` : 'log a shot to start',
			subColor: 'text-bean-sweet'
		},
		{ label: 'Avg Rating', value: avgRating, icon: 'star' },
		{ label: 'Best Bean', value: bestBean(), sub: 'highest avg rating', small: true },
		{ label: 'Active Bags', value: String(activeBags), circles: true }
	]);

	let hoveredBar: number | null = $state(null);
</script>

<svelte:head>
	<title>Dashboard | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Page header -->
		<section class="mb-14" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Precision Analysis</p>
			<h1 class="text-headline-xl mb-3">Morning <em class="font-normal italic">Ritual</em></h1>
			<p class="text-body-lg max-w-2xl text-on-surface-variant">
				Welcome back, Lenny. Here's your extraction overview.
			</p>
		</section>

		<!-- ── Stats row ── -->
		<div class="mb-10 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4" use:reveal={0}>
			{#each statCards as card}
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
					<p class="text-label-sm mb-4 text-on-surface-variant uppercase">{card.label}</p>
					{#if card.icon}
						<div class="flex items-baseline gap-2">
							<span class="text-headline-lg font-display">{card.value}</span>
							<span class="material-symbols-outlined text-crema-gold text-[20px]" style="font-variation-settings: 'FILL' 1">star</span>
						</div>
					{:else if card.circles}
						<div class="flex items-center gap-4">
							<div class="flex -space-x-2">
								<div class="h-8 w-8 rounded-full border-2 border-surface-bright bg-bean-body"></div>
								<div class="h-8 w-8 rounded-full border-2 border-surface-bright bg-bean-floral"></div>
								<div class="h-8 w-8 rounded-full border-2 border-surface-bright bg-crema-gold/40"></div>
							</div>
							<span class="text-headline-lg font-display">{card.value}</span>
						</div>
					{:else if card.small}
						<div class="flex flex-col">
							<span class="font-mono text-[15px] font-semibold">{card.value}</span>
							<span class="text-label-caps mt-1 text-on-surface-variant/60">{card.sub}</span>
						</div>
					{:else}
						<div class="flex items-baseline gap-2">
							<span class="text-headline-lg font-display">{card.value}</span>
							{#if card.sub}
								<span class="font-mono text-[12px] {card.subColor}">{card.sub}</span>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- ── Visualization row ── -->
		<div class="mb-10 grid grid-cols-1 gap-gutter lg:grid-cols-12" use:reveal={0}>

			<!-- Bar chart card (8 cols) -->
			<div class="relative col-span-1 h-[440px] overflow-hidden rounded-xl border border-primary/5 bg-surface-container-lowest p-8 lg:col-span-8">
				<div class="relative z-10 mb-8 flex items-start justify-between">
					<div>
						<h3 class="text-headline-md">Rating History</h3>
						<p class="text-body-md mt-1 italic text-on-surface-variant/70">Correlating roast level and extraction yield over 30 days.</p>
					</div>
					<div class="flex gap-2">
						<button class="text-label-caps rounded-full bg-surface-container-high px-3 py-1.5 text-[10px] uppercase transition-colors hover:bg-surface-container-highest">Yield %</button>
						<button class="text-label-caps rounded-full border border-crema-gold/25 bg-crema-gold/10 px-3 py-1.5 text-[10px] uppercase text-crema-gold transition-colors hover:bg-crema-gold/20">TDS Value</button>
					</div>
				</div>

				<!-- Bars -->
				<div class="absolute inset-x-8 bottom-10 top-28 flex items-end gap-1.5">
					{#if bars.length === 0}
						<div class="flex flex-1 items-center justify-center text-on-surface-variant/40">
							<span class="text-label-caps">Log shots to see your rating history</span>
						</div>
					{/if}
					{#each bars as bar, i}
						<div
							class="group relative flex-1 cursor-pointer rounded-t-sm transition-all duration-700"
							style="height: {hoveredBar === i ? Math.min(bar.h + 12, 100) : bar.h}%; background: {bar.peak ? '#C5A059' : '#F0EEE9'}"
							onmouseenter={() => (hoveredBar = i)}
							onmouseleave={() => (hoveredBar = null)}
							onclick={() => goto('/history')}
							role="button"
							tabindex={i}
						>
							<!-- Tooltip -->
							<div
								class="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-inverse-surface px-2 py-1 font-mono text-[10px] text-inverse-on-surface shadow transition-opacity duration-200"
								style="opacity: {hoveredBar === i ? 1 : 0}"
							>
								{bar.peak ? 'PEAK · ' : ''}{bar.tooltip}
							</div>
						</div>
					{/each}
				</div>

				<!-- Bottom axis labels -->
				<div class="absolute bottom-3 left-8 right-8 flex justify-between">
					{#each bars.filter((_, i) => i === 0 || i === Math.floor(bars.length / 3) || i === Math.floor((2 * bars.length) / 3) || i === bars.length - 1) as bar}
						<span class="font-mono text-[9px] text-on-surface-variant/40">{bar.label}</span>
					{/each}
				</div>
			</div>

			<!-- Sensory / Flavor profile card (4 cols) -->
			<a
				href="/library"
				class="group relative col-span-1 h-[440px] cursor-pointer overflow-hidden rounded-xl bg-tertiary-container transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-4"
			>
				<img
					src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&auto=format&fit=crop&q=80"
					alt="Coffee bloom macro"
					class="absolute inset-0 h-full w-full object-cover opacity-20 transition-all duration-500 group-hover:opacity-30 group-hover:scale-105"
				/>
				<div class="relative z-10 flex h-full flex-col p-8">
					<span class="material-symbols-outlined mb-5 text-[32px] text-crema-gold transition-transform duration-500 group-hover:rotate-12">coffee_maker</span>
					<h3 class="text-headline-md mb-2 text-surface-bright transition-colors group-hover:text-crema-gold">Flavor Profile</h3>
					<p class="text-body-md text-on-primary-container">
						Your recent extractions trend towards "Stone Fruit" and "Jasmine" with high clarity.
					</p>
					<div class="mt-auto rounded-lg border border-surface-bright/20 bg-surface-bright/10 p-4 backdrop-blur-md transition-colors group-hover:bg-surface-bright/20">
						<div class="mb-2.5 flex items-center justify-between">
							<span class="font-mono text-[11px] uppercase tracking-wider text-surface-bright/80">Current Preference</span>
							<span class="font-mono text-[11px] text-crema-gold">88% Match</span>
						</div>
						<div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-bright/10">
							<div
								class="h-full rounded-full bg-crema-gold transition-all duration-[1200ms] ease-out group-hover:w-[88%]"
								style="width: 72%"
							></div>
						</div>
					</div>
				</div>
			</a>
		</div>

		<!-- ── Recent Rituals ── -->
		<section use:reveal={0}>
			<div class="mb-8 flex items-end justify-between">
				<div>
					<h3 class="text-headline-md">Recent Rituals</h3>
					<p class="text-body-md text-on-surface-variant">Extraction logs from the last 24 hours.</p>
				</div>
				<a
					href="/history"
					class="group text-label-sm flex items-center gap-1 text-crema-gold uppercase tracking-widest transition-all hover:underline hover:text-crema-gold/80"
				>
					View Full Archive <span class="material-symbols-outlined ml-1 text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
				</a>
			</div>

			{#if recentRituals.length === 0}
				<div class="flex flex-col items-center rounded-xl border border-primary/5 bg-surface-container-low py-14 text-center">
					<span class="material-symbols-outlined mb-4 text-[48px] text-crema-gold/30">coffee</span>
					<p class="text-headline-md mb-2 text-on-surface-variant">No shots logged yet</p>
					<p class="text-body-md mb-6 text-on-surface-variant/60">Head to the Shot Logger to record your first extraction.</p>
					<a href="/shot-logger" class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
						Log a Shot
					</a>
				</div>
			{:else}
				<div class="space-y-3">
					{#each recentRituals as ritual (ritual.id)}
						<a
							href="/history"
							class="group flex items-center gap-6 rounded-xl border border-primary/5 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-container-low hover:shadow-md"
						>
							<div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container-high">
								<BeanImage
									src={ritual.img}
									alt={ritual.name}
									class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
								/>
							</div>
							<div class="flex-1">
								<h4 class="text-body-lg font-semibold transition-colors group-hover:text-crema-gold">{ritual.name}</h4>
								<p class="text-body-md text-on-surface-variant">{ritual.method}</p>
							</div>
							<div class="hidden items-center gap-8 md:flex">
								<div class="text-right">
									<p class="font-mono text-[11px] uppercase text-on-surface-variant">Time</p>
									<p class="font-mono text-body-md">{ritual.time}</p>
								</div>
								<div class="text-right">
									<p class="font-mono text-[11px] uppercase text-on-surface-variant">Ratio</p>
									<p class="font-mono text-body-md text-bean-sweet">{ritual.ratio}</p>
								</div>
								<div class="flex gap-0.5">
									{#each stars(ritual.rating) as filled}
										<span
											class="material-symbols-outlined text-crema-gold text-[16px]"
											style="font-variation-settings: 'FILL' {filled ? 1 : 0}, 'wght' 300"
										>star</span>
									{/each}
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>
