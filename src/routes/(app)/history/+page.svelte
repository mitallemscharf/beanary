<script lang="ts">
	import { shots } from '$lib/stores/shots';
	import { reveal } from '$lib/actions/reveal';
	import { showToast } from '$lib/stores/toast';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	let filterOpen = $state(false);
	let filterQuery = $state('');

	const filteredShots = $derived(
		filterQuery.trim()
			? $shots.filter((s) => s.bean.toLowerCase().includes(filterQuery.toLowerCase()))
			: $shots
	);

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

	let expandedId: string | null = $state(null);
	let openMenuId: string | null = $state(null);
	let deletingId: string | null = $state(null);

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	// ── Confirm delete ──
	let confirmOpen = $state(false);
	let pendingDelete: { id: string; bean: string } | null = $state(null);

	function requestDelete(id: string, bean: string) {
		openMenuId = null;
		pendingDelete = { id, bean };
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!pendingDelete) return;
		const { id, bean } = pendingDelete;
		confirmOpen = false;
		deletingId = id;
		try {
			await shots.remove(id);
			showToast(`Removed ${bean} shot`, 'delete');
		} catch {
			showToast('Failed to delete — try again', 'error');
		} finally {
			deletingId = null;
			pendingDelete = null;
		}
	}

	// ── Compare mode ──
	let compareMode = $state(false);
	let selectedIds = $state<string[]>([]);
	let showCompareModal = $state(false);

	const compareShots = $derived(
		selectedIds.map((id) => $shots.find((s) => s.id === id)).filter(Boolean) as typeof $shots
	);

	function toggleSelect(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((x) => x !== id);
		} else if (selectedIds.length < 2) {
			selectedIds = [...selectedIds, id];
		} else {
			showToast('Select only 2 shots to compare', 'info');
		}
	}

	function openCompare() {
		if (selectedIds.length === 2) showCompareModal = true;
	}

	function exitCompare() {
		compareMode = false;
		selectedIds = [];
		showCompareModal = false;
	}

	function differs(a: unknown, b: unknown) {
		return String(a) !== String(b);
	}

	type Shot = (typeof $shots)[0];
	function compareRows(a: Shot, b: Shot) {
		return [
			{ label: 'Dose',        va: `${a.dose}g`,  vb: `${b.dose}g`,  diff: differs(a.dose, b.dose) },
			{ label: 'Yield',       va: `${a.yield}g`, vb: `${b.yield}g`, diff: differs(a.yield, b.yield) },
			{ label: 'Brew Ratio',  va: `1:${(a.yield/a.dose).toFixed(1)}`, vb: `1:${(b.yield/b.dose).toFixed(1)}`, diff: differs((a.yield/a.dose).toFixed(1),(b.yield/b.dose).toFixed(1)) },
			{ label: 'Grind Size',  va: a.grind||'—',  vb: b.grind||'—',  diff: differs(a.grind, b.grind) },
			{ label: 'Time',        va: `${a.time}s`,  vb: `${b.time}s`,  diff: differs(a.time, b.time) },
			{ label: 'Temperature', va: `${a.temp}°C`, vb: `${b.temp}°C`, diff: differs(a.temp, b.temp) },
			{ label: 'Rating',      va: a.rating,      vb: b.rating,      diff: differs(a.rating, b.rating), isRating: true },
			{ label: 'Tasting Notes', va: a.notes||'—', vb: b.notes||'—', diff: differs(a.notes, b.notes), isNotes: true },
		];
	}

	// ── PDF Export ──
	async function exportPDF() {
		const { jsPDF } = await import('jspdf');
		const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

		const PAGE_W = doc.internal.pageSize.getWidth();
		const PAGE_H = doc.internal.pageSize.getHeight();
		const MARGIN = 14;

		const gold     = [197, 160, 89]  as [number, number, number];
		const dark     = [27, 28, 25]    as [number, number, number];
		const darkBg   = [44, 27, 24]    as [number, number, number];
		const lightRow = [245, 243, 238] as [number, number, number];

		// Header bar
		doc.setFillColor(...gold);
		doc.rect(0, 0, PAGE_W, 24, 'F');

		doc.setFont('helvetica', 'bold');
		doc.setFontSize(20);
		doc.setTextColor(255, 255, 255);
		doc.text('BEANERY', MARGIN, 15);

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);
		doc.text('Coffee Extraction Journal', MARGIN, 21);

		const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
		doc.text(`Exported: ${dateStr}`, PAGE_W - MARGIN, 15, { align: 'right' });
		doc.text(`${$shots.length} shots recorded`, PAGE_W - MARGIN, 21, { align: 'right' });

		// Column definitions
		const columns = [
			{ label: 'DATE',   w: 28 },
			{ label: 'BEAN',   w: 52 },
			{ label: 'DOSE',   w: 18 },
			{ label: 'YIELD',  w: 18 },
			{ label: 'RATIO',  w: 20 },
			{ label: 'TIME',   w: 18 },
			{ label: 'TEMP',   w: 20 },
			{ label: 'RATING', w: 20 },
			{ label: 'NOTES',  w: 0  },
		];
		const fixedW = columns.slice(0, -1).reduce((s, c) => s + c.w, 0);
		columns[columns.length - 1].w = PAGE_W - MARGIN * 2 - fixedW;

		let y = 34;

		function drawHeader() {
			doc.setFillColor(...darkBg);
			doc.rect(MARGIN, y - 5, PAGE_W - MARGIN * 2, 8, 'F');
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(7);
			doc.setTextColor(...gold);
			let x = MARGIN;
			for (const col of columns) { doc.text(col.label, x + 2, y); x += col.w; }
			y += 8;
		}

		drawHeader();

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(8);

		for (let i = 0; i < $shots.length; i++) {
			const s = $shots[i];
			if (i % 2 === 0) {
				doc.setFillColor(...lightRow);
				doc.rect(MARGIN, y - 4, PAGE_W - MARGIN * 2, 7, 'F');
			}
			doc.setTextColor(...dark);
			const vals = [
				s.date,
				s.bean.length > 28 ? s.bean.slice(0, 26) + '…' : s.bean,
				`${s.dose}g`,
				`${s.yield}g`,
				`1:${(s.yield / s.dose).toFixed(1)}`,
				`${s.time}s`,
				`${s.temp}°C`,
				`${s.rating}/5`,
				(s.notes || '—').slice(0, 35),
			];
			let x = MARGIN;
			for (let j = 0; j < vals.length; j++) { doc.text(vals[j], x + 2, y); x += columns[j].w; }
			y += 7;
			if (y > PAGE_H - 25) { doc.addPage(); y = 14; drawHeader(); }
		}

		// Summary section
		y += 8;
		if (y > PAGE_H - 35) { doc.addPage(); y = 20; }

		const totalShots = $shots.length;
		const avgRating  = totalShots > 0 ? ($shots.reduce((s, sh) => s + sh.rating, 0) / totalShots).toFixed(2) : '0';
		const bestBean   = [...$shots].sort((a, b) => b.rating - a.rating)[0]?.bean || '—';

		doc.setFillColor(...gold);
		doc.rect(MARGIN, y - 4, PAGE_W - MARGIN * 2, 8, 'F');
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(8);
		doc.setTextColor(255, 255, 255);
		doc.text('SUMMARY', MARGIN + 2, y);
		y += 10;

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(9);
		doc.setTextColor(...dark);
		doc.text(`Total shots: ${totalShots}`, MARGIN + 4, y); y += 7;
		doc.text(`Average rating: ${avgRating} / 5`, MARGIN + 4, y); y += 7;
		doc.text(`Best rated bean: ${bestBean}`, MARGIN + 4, y);

		doc.save('beanery-shots.pdf');
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

<ConfirmModal
	open={confirmOpen}
	title="Delete this shot?"
	message={pendingDelete ? `Remove your ${pendingDelete.bean} shot? This cannot be undone.` : ''}
	confirmLabel="Delete"
	onconfirm={confirmDelete}
	oncancel={() => { confirmOpen = false; pendingDelete = null; }}
/>

<!-- ── Compare Modal ── -->
{#if showCompareModal && compareShots.length === 2}
	{@const [a, b] = compareShots}
	{@const aWins = a.rating > b.rating}
	{@const bWins = b.rating > a.rating}
	{@const tied = a.rating === b.rating}

	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
		onclick={() => (showCompareModal = false)}
		aria-label="Close comparison"
		style="animation: fadeIn 0.2s ease-out"
	></button>

	<!-- Modal -->
	<div
		class="fixed inset-x-4 top-1/2 z-50 max-h-[90vh] max-w-4xl -translate-y-1/2 overflow-y-auto rounded-2xl border border-outline-variant/20 bg-surface shadow-2xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2"
		style="animation: modalIn 0.28s cubic-bezier(0.22,1,0.36,1)"
	>
		<!-- Header -->
		<div class="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface px-6 py-5">
			<div class="flex items-center gap-3">
				<span class="material-symbols-outlined text-crema-gold text-[22px]">compare_arrows</span>
				<div>
					<h2 class="text-headline-md">Shot Comparison</h2>
					<p class="text-label-caps mt-0.5 text-on-surface-variant/60">Differences highlighted in gold</p>
				</div>
			</div>
			<button
				onclick={() => (showCompareModal = false)}
				class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95"
				aria-label="Close"
			>
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>
		</div>

		<!-- Winner banner -->
		{#if !tied}
			<div class="border-b border-crema-gold/20 bg-crema-gold/5 px-6 py-3 flex items-center gap-2">
				<span class="material-symbols-outlined text-crema-gold text-[18px]" style="font-variation-settings:'FILL' 1">emoji_events</span>
				<p class="text-label-caps text-crema-gold">
					{aWins ? a.bean : b.bean} wins — rated {aWins ? a.rating : b.rating}/5
				</p>
			</div>
		{:else}
			<div class="border-b border-outline-variant/10 bg-surface-container-low px-6 py-3 flex items-center gap-2">
				<span class="material-symbols-outlined text-on-surface-variant text-[18px]">balance</span>
				<p class="text-label-caps text-on-surface-variant/60">Tie — both rated {a.rating}/5</p>
			</div>
		{/if}

		<!-- Comparison table -->
		<div class="p-6">
			<!-- Shot headers -->
			<div class="mb-6 grid grid-cols-3 gap-4">
				<div class="text-label-caps text-on-surface-variant/40 pt-2">Field</div>
				{#each [a, b] as shot, idx}
					<div class="relative rounded-xl border {(idx === 0 && aWins) || (idx === 1 && bWins) ? 'border-crema-gold/40 bg-crema-gold/5' : 'border-primary/5 bg-surface-container-low'} p-4">
						<div class="flex items-center gap-3 mb-2">
							<img src={shot.img} alt={shot.bean} class="h-10 w-10 rounded-lg object-cover" />
							<div class="min-w-0">
								<p class="text-label-sm font-semibold truncate">{shot.bean}</p>
								<p class="text-label-caps text-on-surface-variant/50">{shot.date}</p>
							</div>
						</div>
						{#if (idx === 0 && aWins) || (idx === 1 && bWins)}
							<span class="absolute right-3 top-3 material-symbols-outlined text-crema-gold text-[18px]" style="font-variation-settings:'FILL' 1">emoji_events</span>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Rows -->
			<!-- Rows -->
			<div class="space-y-2">
				{#each compareRows(a, b) as row}
					<div class="grid grid-cols-3 gap-4 rounded-lg px-2 py-2.5 transition-colors {row.diff ? 'bg-crema-gold/5' : ''}">
						<div class="flex items-center">
							<span class="text-label-caps text-on-surface-variant/50">{row.label}</span>
							{#if row.diff}
								<span class="ml-2 h-1.5 w-1.5 rounded-full bg-crema-gold"></span>
							{/if}
						</div>
						{#each [row.va, row.vb] as val}
							<div>
								{#if row.isRating}
									<div class="flex gap-0.5">
										{#each Array.from({length:5},(_,i)=>i<Number(val)) as filled}
											<span class="material-symbols-outlined text-[16px] {row.diff ? 'text-crema-gold' : 'text-crema-gold'}"
												style="font-variation-settings:'FILL' {filled?1:0},'wght' 300">star</span>
										{/each}
									</div>
								{:else if row.isNotes}
									<p class="font-mono text-[12px] leading-relaxed {row.diff ? 'text-crema-gold' : 'text-on-surface-variant'}">{val}</p>
								{:else}
									<span class="font-mono text-sm font-semibold {row.diff ? 'text-crema-gold' : 'text-primary'}">{val}</span>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>

			<p class="mt-4 text-center text-label-caps text-on-surface-variant/30">● Gold = values differ between shots</p>
		</div>
	</div>
{/if}

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
			<div class="flex flex-col items-start gap-2 md:items-end">
				<div class="flex flex-wrap gap-3">
					<!-- Compare mode toggle -->
					<button
						onclick={() => { compareMode = !compareMode; if (!compareMode) { selectedIds = []; showCompareModal = false; } }}
						class="flex items-center gap-2 rounded-lg px-4 py-2.5 text-body-md transition-all duration-200 active:scale-95 {compareMode ? 'bg-crema-gold text-white shadow-sm' : 'bg-surface-container-high hover:bg-surface-container-highest'}"
					>
						<span class="material-symbols-outlined text-[18px]">compare_arrows</span>
						Compare
					</button>
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
					<button
						onclick={exportPDF}
						class="flex items-center gap-2 rounded-lg bg-surface-container-high px-4 py-2.5 text-body-md transition-all duration-200 hover:bg-surface-container-highest active:scale-95"
					>
						<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
						Export PDF
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

		<!-- Compare mode banner -->
		{#if compareMode}
			<div class="mb-8 flex items-center justify-between rounded-xl border border-crema-gold/30 bg-crema-gold/5 px-6 py-4" style="animation: fadeDown 0.2s ease-out">
				<div class="flex items-center gap-3">
					<span class="material-symbols-outlined text-crema-gold text-[20px]">touch_app</span>
					<p class="text-body-md text-on-surface">
						{#if selectedIds.length === 0}
							Select 2 shots to compare
						{:else if selectedIds.length === 1}
							<span class="text-crema-gold font-semibold">1 selected</span> — select 1 more
						{:else}
							<span class="text-crema-gold font-semibold">2 shots selected</span> — ready to compare
						{/if}
					</p>
				</div>
				<div class="flex items-center gap-3">
					{#if selectedIds.length === 2}
						<button
							onclick={openCompare}
							class="text-label-caps rounded-full bg-crema-gold px-5 py-2.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 active:scale-95"
						>
							Compare Now
						</button>
					{/if}
					<button onclick={exitCompare} class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high active:scale-95">
						<span class="material-symbols-outlined text-[18px]">close</span>
					</button>
				</div>
			</div>
		{/if}

		<!-- Grouped sections -->
		<div class="space-y-14">
			{#each grouped() as [date, group]}
				<section use:reveal={0}>
					<h2 class="text-label-caps mb-5 border-b border-outline-variant/10 pb-2.5 text-crema-gold">
						{date}
					</h2>
					<div class="space-y-3">
						{#each group as shot}
							{@const isBest = shot.rating === 5}
							{@const isExpanded = expandedId === shot.id}
							{@const isSelected = selectedIds.includes(shot.id)}
							<div class="{deletingId === shot.id ? 'opacity-40 pointer-events-none' : ''}">
								<!-- Main row -->
								<div
									class="group relative flex cursor-pointer flex-wrap items-center justify-between gap-6 rounded-xl border bg-surface-bright p-6 transition-all duration-300 hover:bg-surface-container-low hover:shadow-sm
										{isSelected ? 'border-crema-gold/50 bg-crema-gold/5 shadow-sm' : 'border-primary/5'}
										{isExpanded && !compareMode ? 'rounded-b-none border-b-0 bg-surface-container-low shadow-sm' : ''}"
									onclick={() => compareMode ? toggleSelect(shot.id) : toggleExpand(shot.id)}
									role="button"
									tabindex="0"
									onkeydown={(e) => e.key === 'Enter' && (compareMode ? toggleSelect(shot.id) : toggleExpand(shot.id))}
								>
									<!-- Compare checkbox -->
									{#if compareMode}
										<div class="flex-shrink-0">
											<div class="flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all {isSelected ? 'border-crema-gold bg-crema-gold' : 'border-outline-variant/40 bg-transparent'}">
												{#if isSelected}
													<span class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings:'FILL' 1">check</span>
												{/if}
											</div>
										</div>
									{/if}

									<!-- Left: image + info -->
									<div class="flex min-w-[200px] flex-1 items-center gap-6">
										<div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
											<img
												src={shot.img}
												alt={shot.bean}
												class="h-full w-full object-cover transition-all duration-500 {isExpanded ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}"
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
												<span class="h-2 w-2 rounded-full" style="background-color: {processColors[shot.process] ?? processColors.default}"></span>
												<p class="text-label-caps text-on-surface-variant/70">{shot.process} • {shot.roast}</p>
											</div>
										</div>
									</div>

									<!-- Center: data -->
									<div class="flex flex-wrap items-center gap-4 text-sm sm:gap-10">
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
										<div class="flex gap-0.5">
											{#each stars(shot.rating) as filled}
												<span class="material-symbols-outlined text-crema-gold text-base" style="font-variation-settings: 'FILL' {filled ? 1 : 0}, 'wght' 300">star</span>
											{/each}
										</div>
									</div>

									<!-- Actions (hidden in compare mode) -->
									{#if !compareMode}
										<div class="relative flex-shrink-0 flex items-center gap-1">
											<span class="material-symbols-outlined text-[18px] text-on-surface-variant/30 transition-transform duration-300 {isExpanded ? 'rotate-180' : ''}">expand_more</span>
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
														onclick={(e) => { e.stopPropagation(); requestDelete(shot.id, shot.bean); }}
														class="flex w-full items-center gap-3 px-4 py-3 text-left text-error transition-colors hover:bg-error/5"
													>
														<span class="material-symbols-outlined text-[17px]">delete</span>
														<span class="text-label-sm uppercase">Delete shot</span>
													</button>
												</div>
											{/if}
										</div>
									{/if}
								</div>

								<!-- Inline expand panel -->
								{#if isExpanded && !compareMode}
									<div
										class="rounded-b-xl border border-t-0 border-primary/5 bg-surface-container-low px-4 py-5 sm:px-8 sm:py-6"
										style="animation: expandDown 0.22s cubic-bezier(0.22,1,0.36,1)"
									>
										<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
											<div>
												<p class="text-label-caps mb-1 text-on-surface-variant/50">Grind Size</p>
												<p class="font-mono text-sm font-medium">{shot.grind || '—'}</p>
											</div>
											<div>
												<p class="text-label-caps mb-1 text-on-surface-variant/50">Dose</p>
												<p class="font-mono text-sm font-medium">{shot.dose}g</p>
											</div>
											<div>
												<p class="text-label-caps mb-1 text-on-surface-variant/50">Yield</p>
												<p class="font-mono text-sm font-medium">{shot.yield}g</p>
											</div>
											<div>
												<p class="text-label-caps mb-1 text-on-surface-variant/50">Brew Ratio</p>
												<p class="font-mono text-sm font-medium text-crema-gold">1:{(shot.yield / shot.dose).toFixed(1)}</p>
											</div>
										</div>
										{#if shot.notes}
											<div class="mt-5 rounded-lg border border-outline-variant/15 bg-surface-container/60 p-4">
												<p class="text-label-caps mb-2 text-crema-gold">Tasting Notes</p>
												<p class="text-body-md text-on-surface-variant">{shot.notes}</p>
											</div>
										{/if}
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
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes fadeDown {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes menuIn {
		from { opacity: 0; transform: scale(0.95) translateY(-4px); }
		to { opacity: 1; transform: scale(1) translateY(0); }
	}
	@keyframes expandDown {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}
	@keyframes modalIn {
		from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 16px)) scale(0.97); }
		to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
	}
</style>
