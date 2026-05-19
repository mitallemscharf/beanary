<script lang="ts">
	import { shots } from '$lib/stores/shots';
	import { reveal } from '$lib/actions/reveal';
	import { showToast } from '$lib/stores/toast';

	let filterOpen = $state(false);
	let filterQuery = $state('');

	const filteredShots = $derived(
		filterQuery.trim()
			? $shots.filter((s) => s.bean.toLowerCase().includes(filterQuery.toLowerCase()))
			: $shots
	);

	// Group shots by date
	const grouped = $derived(() => {
		const groups: Record<string, typeof $shots> = {};
		for (const shot of filteredShots) {
			if (!groups[shot.date]) groups[shot.date] = [];
			groups[shot.date].push(shot);
		}
		return Object.entries(groups);
	});

	function stars(n: number) {
		return Array.from({ length: 5 }, (_, i) => i < n);
	}

	let openMenuId: string | null = $state(null);
	let deletingId: string | null = $state(null);

	async function deleteShot(id: string, beanName: string) {
		if (!confirm(`Delete this shot of ${beanName}? This cannot be undone.`)) return;
		deletingId = id;
		openMenuId = null;
		try {
			await shots.remove(id);
			showToast(`Removed ${beanName}`, 'delete');
		} catch {
			showToast('Failed to delete — try again', 'error');
		} finally {
			deletingId = null;
		}
	}

	const processColors: Record<string, string> = {
		Washed: '#735c00',
		Natural: '#c5a059',
		Anaerobic: '#2c1b18',
		'Pulped Natural': '#fed65b',
		'Washed Process': '#735c00',
		'Natural Process': '#c5a059',
		default: '#817472'
	};
</script>

<svelte:head>
	<title>Shot History | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-24 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Page header -->
		<header class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" use:reveal={0}>
			<div>
				<p class="text-label-caps mb-2 text-crema-gold">Extraction Records</p>
				<h1 class="text-headline-xl text-primary">Shot History</h1>
				<p class="text-body-lg mt-2 text-on-surface-variant">Precision records from your daily espresso ritual.</p>
			</div>
			<div class="flex flex-col items-end gap-2">
				<div class="flex gap-3">
					<button
						onclick={() => { filterOpen = !filterOpen; if (!filterOpen) filterQuery = ''; }}
						class="flex items-center gap-2 rounded-lg px-4 py-2.5 text-body-md transition-all duration-200 active:scale-95 {filterOpen ? 'bg-crema-gold/15 text-crema-gold ring-1 ring-crema-gold/30' : 'bg-surface-container-high hover:bg-surface-container-highest'}"
					>
						<span class="material-symbols-outlined text-[18px]">filter_list</span>
						Filter
					</button>
					<button
						onclick={() => {
							const csv = ['Bean,Dose,Yield,Time,Temp,Rating,Date,Notes',
								...$shots.map(s => `"${s.bean}",${s.dose},${s.yield},${s.time},${s.temp},${s.rating},"${s.date}","${s.notes}"`)
							].join('\n');
							const a = document.createElement('a');
							a.href = 'data:text/csv,' + encodeURIComponent(csv);
							a.download = 'beanery-shots.csv';
							a.click();
						}}
						class="flex items-center gap-2 rounded-lg bg-surface-container-high px-4 py-2.5 text-body-md transition-all duration-200 hover:bg-surface-container-highest active:scale-95"
					>
						<span class="material-symbols-outlined text-[18px]">file_download</span>
						Export CSV
					</button>
				</div>
				{#if filterOpen}
					<div class="relative flex items-center" style="animation: fadeDown 0.2s ease-out">
						<span class="material-symbols-outlined absolute left-3 text-outline text-[16px]">search</span>
						<input
							type="text"
							placeholder="Filter by bean name..."
							bind:value={filterQuery}
							autofocus
							class="text-body-md w-56 rounded-full border border-crema-gold/30 bg-surface-container-low py-2 pl-9 pr-4 outline-none ring-0 transition-all duration-200 focus:ring-1 focus:ring-crema-gold/60"
						/>
						{#if filterQuery}
							<button onclick={() => (filterQuery = '')} class="absolute right-3 text-outline hover:text-on-surface">
								<span class="material-symbols-outlined text-[16px]">close</span>
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</header>

		<!-- Grouped sections -->
		<div class="space-y-14">
			{#each grouped() as [date, group]}
				<section use:reveal={0}>
					<h2 class="text-label-caps mb-5 border-b border-outline-variant/10 pb-2.5 text-crema-gold">
						{date}
					</h2>
					<div class="space-y-3">
						{#each group as shot, i}
							{@const isBest = shot.rating === 5}
							<div
								class="group relative flex cursor-pointer flex-wrap items-center justify-between gap-6 rounded-xl border border-primary/5 bg-surface-bright p-6 transition-all duration-300 hover:bg-surface-container-low hover:shadow-sm {deletingId === shot.id ? 'opacity-40 pointer-events-none' : ''}"
							>
								<!-- Left: image + info -->
								<div class="flex min-w-[260px] flex-1 items-center gap-6">
									<div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
										<img
											src={shot.img}
											alt={shot.bean}
											class="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
										/>
									</div>
									<div>
										<div class="mb-1 flex items-center gap-2">
											<h3 class="text-headline-md">{shot.bean}</h3>
											{#if isBest}
												<span class="material-symbols-outlined text-crema-gold text-[18px]" style="font-variation-settings: 'FILL' 1">emoji_events</span>
											{/if}
										</div>
										<div class="flex items-center gap-2.5">
											<span
												class="h-2 w-2 rounded-full"
												style="background-color: {processColors[shot.process] ?? processColors.default}"
											></span>
											<p class="text-label-caps text-on-surface-variant/70">{shot.process} • {shot.roast}</p>
										</div>
									</div>
								</div>

								<!-- Center: data -->
								<div class="flex items-center gap-10 text-sm">
									{#each [
										{ label: 'Ratio', val: `${shot.dose}g / ${shot.yield}g` },
										{ label: 'Time', val: `${shot.time}s` },
										{ label: 'Temp', val: `${shot.temp}°C` }
									] as col}
										<div class="flex flex-col items-center gap-0.5">
											<span class="text-label-caps text-on-surface-variant/50">{col.label}</span>
											<span class="font-mono text-sm font-medium text-primary">{col.val}</span>
										</div>
									{/each}

									<!-- Stars -->
									<div class="flex gap-0.5">
										{#each stars(shot.rating) as filled}
											<span
												class="material-symbols-outlined text-crema-gold text-base"
												style="font-variation-settings: 'FILL' {filled ? 1 : 0}, 'wght' 300"
											>star</span>
										{/each}
									</div>
								</div>

								<!-- Actions -->
								<div class="relative flex-shrink-0">
									<button
										onclick={(e) => { e.stopPropagation(); openMenuId = openMenuId === shot.id ? null : shot.id; }}
										class="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
										aria-label="More options"
									>
										<span class="material-symbols-outlined text-[20px]">more_vert</span>
									</button>
									{#if openMenuId === shot.id}
										<div
											class="absolute right-0 top-12 z-30 min-w-[160px] overflow-hidden rounded-xl border border-outline-variant/20 bg-surface shadow-xl"
											style="animation: menuIn 0.15s ease-out"
										>
											<button
												onclick={() => deleteShot(shot.id, shot.bean)}
												class="flex w-full items-center gap-3 px-4 py-3 text-left text-error transition-colors hover:bg-error/5"
											>
												<span class="material-symbols-outlined text-[17px]">delete</span>
												<span class="text-label-sm uppercase">Delete shot</span>
											</button>
											<button
												onclick={() => { openMenuId = null; showToast('Edit coming soon', 'edit'); }}
												class="flex w-full items-center gap-3 px-4 py-3 text-left text-on-surface-variant transition-colors hover:bg-surface-container-high"
											>
												<span class="material-symbols-outlined text-[17px]">edit</span>
												<span class="text-label-sm uppercase">Edit</span>
											</button>
										</div>
									{/if}
								</div>

								<!-- Notes tooltip on hover -->
								{#if shot.notes}
									<div class="absolute -top-10 left-6 z-20 hidden rounded-lg bg-inverse-surface px-3 py-1.5 text-[11px] text-inverse-on-surface shadow-md group-hover:block">
										{shot.notes.slice(0, 60)}{shot.notes.length > 60 ? '…' : ''}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/each}

			{#if filteredShots.length === 0 && filterQuery}
				<div class="flex flex-col items-center py-20 text-center" use:reveal={0}>
					<span class="material-symbols-outlined mb-6 text-[56px] text-crema-gold/40">search_off</span>
					<h3 class="text-headline-md mb-2 text-on-surface-variant">No shots match "<em>{filterQuery}</em>"</h3>
					<button onclick={() => (filterQuery = '')} class="text-label-sm mt-4 text-crema-gold underline decoration-crema-gold underline-offset-4">Clear filter</button>
				</div>
			{:else if $shots.length === 0}
				<div class="flex flex-col items-center py-20 text-center" use:reveal={0}>
					<span class="material-symbols-outlined mb-6 text-[56px] text-crema-gold/40">science</span>
					<h3 class="text-headline-md mb-2 text-on-surface-variant">No shots logged yet</h3>
					<p class="text-body-md mb-8 text-on-surface-variant/60">Head to the Shot Logger to record your first extraction.</p>
					<a href="/shot-logger" class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
						Log a Shot
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@keyframes fadeDown {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes menuIn {
		from { opacity: 0; transform: scale(0.95) translateY(-4px); }
		to { opacity: 1; transform: scale(1) translateY(0); }
	}
</style>
