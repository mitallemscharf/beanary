<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { beans, type Bean } from '$lib/stores/beans';
	import { showToast } from '$lib/stores/toast';

	let search = $state('');

	const filtered = $derived(
		search.trim()
			? $beans.filter(
					(b) =>
						b.name.toLowerCase().includes(search.toLowerCase()) ||
						b.origin.toLowerCase().includes(search.toLowerCase()) ||
						b.roastery.toLowerCase().includes(search.toLowerCase())
				)
			: $beans
	);

	function removeBean(id: string) {
		beans.remove(id);
		selectedBean = null;
		showToast('Bean removed from library', 'delete');
	}

	const statusColors: Record<string, string> = {
		Fresh: 'bg-green-500',
		Peak: 'bg-crema-gold',
		'Past Peak': 'bg-outline-variant'
	};

	// ── Drawer state ──
	let selectedBean: Bean | null = $state(null);
	let showAddForm = $state(false);

	function openBean(bean: Bean) {
		showAddForm = false;
		selectedBean = bean;
	}

	function closeDrawer() {
		selectedBean = null;
		showAddForm = false;
	}

	// ── Add-bean form state ──
	let newName = $state('');
	let newRoastery = $state('');
	let newOrigin = $state('');
	let newTagsStr = $state('');
	let newDose = $state('18g');
	let newYield = $state('36g');
	let newTime = $state('30s');
	let newStatus = $state<'Fresh' | 'Peak' | 'Past Peak'>('Fresh');

	const coffeeImgs = [
		'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&auto=format&fit=crop&q=85',
		'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&auto=format&fit=crop&q=85',
		'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=400&auto=format&fit=crop&q=85',
		'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&auto=format&fit=crop&q=85'
	];

	function addBean() {
		if (!newName.trim()) return;
		const tags = newTagsStr
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		beans.add({
			id: Date.now().toString(),
			name: newName,
			roastery: newRoastery || 'Unknown Roastery',
			origin: newOrigin || 'Unknown Origin',
			tags: tags.length ? tags : ['Single Origin'],
			dose: newDose,
			yield: newYield,
			time: newTime,
			status: newStatus,
			img: coffeeImgs[Math.floor(Math.random() * coffeeImgs.length)],
			favorited: false
		});
		showToast('Bean added to library', 'check_circle');
		newName = '';
		newRoastery = '';
		newOrigin = '';
		newTagsStr = '';
		newDose = '18g';
		newYield = '36g';
		newTime = '30s';
		newStatus = 'Fresh';
		showAddForm = false;
	}

	const drawerOpen = $derived(selectedBean !== null || showAddForm);
</script>

<svelte:head>
	<title>Bean Library | Beanery</title>
</svelte:head>

<!-- Backdrop -->
{#if drawerOpen}
	<button
		class="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
		onclick={closeDrawer}
		aria-label="Close panel"
		style="animation: fadeIn 0.2s ease-out"
	></button>
{/if}

<!-- Bean Detail Drawer -->
{#if selectedBean}
	<aside
		class="fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-y-auto bg-surface shadow-2xl sm:w-[420px]"
		style="animation: slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)"
	>
		<div class="relative h-56 w-full flex-shrink-0 overflow-hidden">
			<img src={selectedBean.img} alt={selectedBean.name} class="h-full w-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
			<button
				onclick={closeDrawer}
				class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 active:scale-95"
				aria-label="Close"
			>
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>
			<div class="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-sm">
				<div class="h-2 w-2 rounded-full {statusColors[selectedBean.status] ?? 'bg-outline-variant'}"></div>
				<span class="text-label-caps text-white">{selectedBean.status}</span>
			</div>
		</div>

		<div class="flex flex-1 flex-col p-7">
			<div class="mb-5 flex items-start justify-between">
				<div>
					<h2 class="text-headline-lg leading-tight">{selectedBean.name}</h2>
					<p class="text-label-caps mt-1 text-on-surface-variant/70">{selectedBean.roastery} • {selectedBean.origin}</p>
				</div>
				<button
					onclick={() => { beans.toggleFav(selectedBean!.id); selectedBean = { ...selectedBean!, favorited: !selectedBean!.favorited }; }}
					class="flex-shrink-0 p-1.5 transition-all hover:scale-110 active:scale-90"
					aria-label="Toggle favourite"
				>
					<span
						class="material-symbols-outlined text-[24px]"
						class:text-crema-gold={selectedBean.favorited}
						class:text-on-surface-variant={!selectedBean.favorited}
						style="font-variation-settings: 'FILL' {selectedBean.favorited ? 1 : 0}, 'wght' 300"
					>favorite</span>
				</button>
			</div>

			<div class="mb-6 flex flex-wrap gap-2">
				{#each selectedBean.tags as tag}
					<span class="rounded bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">{tag}</span>
				{/each}
			</div>

			<div class="mb-7 rounded-xl border border-outline-variant/15 bg-surface-container-lowest/50 p-5">
				<p class="text-label-sm mb-4 flex items-center gap-1.5 text-crema-gold">
					<span class="material-symbols-outlined text-[14px]">shutter_speed</span>
					Sweet Spot Settings
				</p>
				<div class="grid grid-cols-3 gap-3 text-center">
					{#each [{ l: 'Dose', v: selectedBean.dose }, { l: 'Yield', v: selectedBean.yield }, { l: 'Time', v: selectedBean.time }] as col}
						<div class="rounded-lg bg-surface-container-high/60 py-3">
							<p class="text-label-caps text-on-surface-variant/50">{col.l}</p>
							<p class="font-display text-[20px] font-semibold">{col.v}</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="mt-auto space-y-3">
				<a
					href="/shot-logger"
					class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full bg-crema-gold py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
				>
					<span class="material-symbols-outlined text-[18px]">biotech</span>
					Log Shot with This Bean
				</a>
				<button
					onclick={() => removeBean(selectedBean!.id)}
					class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full border border-error/20 py-3 text-error uppercase tracking-widest transition-all hover:bg-error/5 active:scale-95"
				>
					<span class="material-symbols-outlined text-[18px]">delete</span>
					Remove from Library
				</button>
			</div>
		</div>
	</aside>
{/if}

<!-- Add New Bean Drawer -->
{#if showAddForm}
	<aside
		class="fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-y-auto bg-surface shadow-2xl sm:w-[420px]"
		style="animation: slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)"
	>
		<div class="flex items-center justify-between border-b border-outline-variant/10 px-7 py-5">
			<div>
				<h2 class="text-headline-md">Add New Bean</h2>
				<p class="text-label-caps mt-0.5 text-crema-gold">Expand Your Collection</p>
			</div>
			<button onclick={closeDrawer} class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95" aria-label="Close">
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>
		</div>

		<form class="flex-1 space-y-5 p-7" onsubmit={(e) => { e.preventDefault(); addBean(); }}>
			<div>
				<label for="new-name" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Bean Name *</label>
				<input id="new-name" type="text" bind:value={newName} placeholder="e.g. Yirgacheffe G1" required
					class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="new-roastery" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Roastery</label>
					<input id="new-roastery" type="text" bind:value={newRoastery} placeholder="Moonlight Roasters"
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
				</div>
				<div>
					<label for="new-origin" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Origin</label>
					<input id="new-origin" type="text" bind:value={newOrigin} placeholder="Ethiopia"
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
				</div>
			</div>
			<div>
				<label for="new-tags" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Flavor Tags</label>
				<input id="new-tags" type="text" bind:value={newTagsStr} placeholder="Floral, Lemon Tart, Tea-like"
					class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
				<p class="text-label-caps mt-1.5 text-on-surface-variant/40">Separate with commas</p>
			</div>

			<div>
				<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Sweet Spot Settings</p>
				<div class="grid grid-cols-3 gap-3">
					<div>
						<label for="new-dose" class="text-label-caps mb-1.5 block text-on-surface-variant/60">Dose</label>
						<input id="new-dose" type="text" bind:value={newDose} placeholder="18g"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-center outline-none focus:ring-2 focus:ring-crema-gold/60" />
					</div>
					<div>
						<label for="new-yield" class="text-label-caps mb-1.5 block text-on-surface-variant/60">Yield</label>
						<input id="new-yield" type="text" bind:value={newYield} placeholder="36g"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-center outline-none focus:ring-2 focus:ring-crema-gold/60" />
					</div>
					<div>
						<label for="new-time" class="text-label-caps mb-1.5 block text-on-surface-variant/60">Time</label>
						<input id="new-time" type="text" bind:value={newTime} placeholder="30s"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-center outline-none focus:ring-2 focus:ring-crema-gold/60" />
					</div>
				</div>
			</div>

			<div>
				<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Freshness Status</p>
				<div class="flex gap-2">
					{#each (['Fresh', 'Peak', 'Past Peak'] as const) as s}
						<button type="button" onclick={() => (newStatus = s)}
							class="flex-1 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all {newStatus === s ? 'bg-crema-gold text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
							{s}
						</button>
					{/each}
				</div>
			</div>

			<div class="border-t border-outline-variant/10 pt-4">
				<button type="submit"
					class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full bg-crema-gold py-4 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-40"
					disabled={!newName.trim()}>
					<span class="material-symbols-outlined text-[18px]">add</span>
					Add to Library
				</button>
			</div>
		</form>
	</aside>
{/if}

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Page header -->
		<header class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" use:reveal={0}>
			<div>
				<p class="text-label-caps mb-2 text-crema-gold">Your Collection</p>
				<h1 class="text-headline-xl text-primary">Bean Library</h1>
				<p class="text-body-lg mt-2 text-on-surface-variant">Curating sensory notes and extraction parameters for your roasts.</p>
			</div>
			<div class="relative">
				<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
				<input type="text" placeholder="Search beans, origins..." bind:value={search}
					class="text-body-md w-64 rounded-full border-none bg-surface-container py-3 pl-11 pr-5 outline-none ring-0 transition-all duration-300 focus:ring-1 focus:ring-crema-gold hover:bg-surface-container-high" />
			</div>
		</header>

		<!-- Grid -->
		<div class="grid grid-cols-1 gap-stack-lg sm:grid-cols-2 xl:grid-cols-3">
			{#each filtered as bean (bean.id)}
				<div
					class="group relative flex h-[490px] cursor-pointer flex-col overflow-hidden rounded-xl border border-primary/5 bg-surface-container-low transition-all duration-300 hover:-translate-y-1.5 hover:border-crema-gold/30 hover:shadow-xl"
					onclick={() => openBean(bean)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && openBean(bean)}
					use:reveal={0}
				>
					<div class="relative h-[240px] w-full flex-shrink-0 overflow-hidden">
						<img src={bean.img} alt={bean.name}
							class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
						<div class="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-bean-floral/75 px-3 py-1 backdrop-blur-sm">
							<div class="h-2 w-2 rounded-full {statusColors[bean.status] ?? 'bg-outline-variant'}"></div>
							<span class="text-label-caps text-white">{bean.status}</span>
						</div>
					</div>

					<div class="flex flex-1 flex-col justify-between p-6">
						<div>
							<div class="mb-2 flex items-start justify-between">
								<h3 class="text-headline-lg leading-tight transition-colors duration-200 group-hover:text-secondary">{bean.name}</h3>
								<button onclick={(e) => { e.stopPropagation(); beans.toggleFav(bean.id); }}
									class="flex-shrink-0 p-1 transition-all active:scale-90 hover:scale-110"
									aria-label="{bean.favorited ? 'Remove from' : 'Add to'} favourites">
									<span class="material-symbols-outlined text-[22px]"
										class:text-crema-gold={bean.favorited}
										class:text-on-surface-variant={!bean.favorited}
										style="font-variation-settings: 'FILL' {bean.favorited ? 1 : 0}, 'wght' 300"
									>favorite</span>
								</button>
							</div>
							<p class="text-label-caps mb-4 text-on-surface-variant/70">{bean.roastery} • {bean.origin}</p>
							<div class="mb-5 flex flex-wrap gap-1.5">
								{#each bean.tags as tag}
									<span class="rounded bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-secondary">{tag}</span>
								{/each}
							</div>
						</div>
						<div class="rounded-xl border border-outline-variant/15 bg-surface-container-highest/50 p-4">
							<p class="text-label-sm mb-3 flex items-center gap-1.5 text-crema-gold">
								<span class="material-symbols-outlined text-[14px]">shutter_speed</span>
								Sweet Spot Settings
							</p>
							<div class="grid grid-cols-3 gap-2 text-center">
								{#each [{ l: 'Dose', v: bean.dose }, { l: 'Yield', v: bean.yield }, { l: 'Time', v: bean.time }] as col}
									<div>
										<p class="text-label-caps text-on-surface-variant/50">{col.l}</p>
										<p class="font-display text-[18px] font-semibold">{col.v}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}

			<button
				class="group flex h-[490px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant/40 bg-transparent transition-all duration-300 hover:border-crema-gold/50 hover:bg-surface-container-low active:scale-[0.98]"
				use:reveal={0}
				onclick={() => { selectedBean = null; showAddForm = true; }}
			>
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high transition-transform duration-200 group-hover:scale-110 group-hover:bg-crema-gold/10">
					<span class="material-symbols-outlined text-[32px] text-crema-gold" style="font-variation-settings: 'FILL' 0">add</span>
				</div>
				<div class="text-center">
					<p class="text-headline-md mb-1 transition-colors duration-200 group-hover:text-crema-gold">Add New Bean</p>
					<p class="text-body-md text-on-surface-variant">Expand your library</p>
				</div>
			</button>
		</div>

		{#if filtered.length === 0 && search}
			<div class="flex flex-col items-center py-20 text-center" use:reveal={0}>
				<span class="material-symbols-outlined mb-4 text-[48px] text-crema-gold/30">search_off</span>
				<p class="text-headline-md text-on-surface-variant">No beans match "<em>{search}</em>"</p>
				<button onclick={() => (search = '')} class="text-label-sm mt-4 text-crema-gold underline decoration-crema-gold underline-offset-4">Clear search</button>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes slideInRight {
		from { transform: translateX(100%); opacity: 0.6; }
		to   { transform: translateX(0); opacity: 1; }
	}
	@keyframes fadeIn {
		from { opacity: 0; }
		to   { opacity: 1; }
	}
</style>
