<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { beans, type Bean, getFreshness } from '$lib/stores/beans';
	import { shots } from '$lib/stores/shots';
	import { showToast } from '$lib/stores/toast';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import BeanImage from '$lib/components/BeanImage.svelte';
	import QRCode from 'qrcode';
	import { browser } from '$app/environment';

	// ── QR Code modal ──
	let qrBean: Bean | null = $state(null);
	let qrDataUrl = $state('');

	async function openQR(bean: Bean) {
		qrBean = bean;
		const url = browser ? `${window.location.origin}/library?bean=${encodeURIComponent(bean.name)}` : '';
		qrDataUrl = await QRCode.toDataURL(url, {
			width: 320,
			margin: 2,
			color: { dark: '#2C1A0E', light: '#FBF9F4' }
		});
	}

	function downloadQR() {
		if (!qrDataUrl || !qrBean) return;
		const a = document.createElement('a');
		a.href = qrDataUrl;
		a.download = `beanery-qr-${qrBean.name.toLowerCase().replace(/\s+/g,'-')}.png`;
		a.click();
		showToast('QR code downloaded', 'download');
	}

	function getRecommendation(beanName: string) {
		const beanShots = $shots.filter((s) => s.bean === beanName);
		if (beanShots.length < 3) return null;
		const sorted = [...beanShots].sort((a, b) => b.rating - a.rating);
		const best = sorted[0];
		const top = sorted.slice(0, Math.min(3, sorted.length));
		const avgDose = +(top.reduce((s, x) => s + x.dose, 0) / top.length).toFixed(1);
		const avgYield = +(top.reduce((s, x) => s + x.yield, 0) / top.length).toFixed(1);
		const avgTime = Math.round(top.reduce((s, x) => s + x.time, 0) / top.length);
		const avgTemp = Math.round(top.reduce((s, x) => s + x.temp, 0) / top.length);
		const grind = best.grind || null;
		return { totalShots: beanShots.length, best, avgDose, avgYield, avgTime, avgTemp, grind, ratio: (avgYield / avgDose).toFixed(1) };
	}

	let savingBean = $state(false);

	// Confirm modal state
	let confirmOpen = $state(false);
	let pendingRemove: { id: string; name: string } | null = $state(null);

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

	function requestRemove(id: string, name: string) {
		pendingRemove = { id, name };
		confirmOpen = true;
	}

	async function confirmRemove() {
		if (!pendingRemove) return;
		const { id, name } = pendingRemove;
		confirmOpen = false;
		pendingRemove = null;
		try {
			await beans.remove(id);
			selectedBean = null;
			showToast(`${name} removed from library`, 'delete');
		} catch {
			showToast('Failed to remove bean — try again', 'error');
		}
	}

	const statusColors: Record<string, string> = {
		Fresh: 'bg-green-500',
		Peak: 'bg-crema-gold',
		'Past Peak': 'bg-outline-variant'
	};

	// ── Drawer state ──
	let selectedBean: Bean | null = $state(null);
	let showAddForm = $state(false);
	let editMode = $state(false);
	let savingEdit = $state(false);

	// Edit-mode field mirrors
	let editName = $state('');
	let editRoastery = $state('');
	let editOrigin = $state('');
	let editRoastLevel = $state<'Light' | 'Medium' | 'Medium-Dark' | 'Dark' | ''>('');
	let editTagsStr = $state('');
	let editDose = $state('');
	let editYield = $state('');
	let editTime = $state('');
	let editStatus = $state<'Fresh' | 'Peak' | 'Past Peak'>('Fresh');
	let editRoastDate = $state('');

	function openBean(bean: Bean) {
		showAddForm = false;
		editMode = false;
		selectedBean = bean;
	}

	function closeDrawer() {
		selectedBean = null;
		showAddForm = false;
		editMode = false;
	}

	function startEdit() {
		if (!selectedBean) return;
		editName = selectedBean.name;
		editRoastery = selectedBean.roastery;
		editOrigin = selectedBean.origin;
		editRoastLevel = selectedBean.roastLevel ?? '';
		editTagsStr = selectedBean.tags.join(', ');
		editDose = selectedBean.dose;
		editYield = selectedBean.yield;
		editTime = selectedBean.time;
		editStatus = selectedBean.status;
		editRoastDate = selectedBean.roastDate ? selectedBean.roastDate.slice(0, 10) : '';
		editMode = true;
	}

	async function saveEdit() {
		if (!selectedBean || !editName.trim() || savingEdit) return;
		savingEdit = true;
		const tags = editTagsStr.split(',').map((t) => t.trim()).filter(Boolean);
		try {
			const updated = await beans.updateBean(selectedBean.id, {
				name: editName.trim(),
				roastery: editRoastery || 'Unknown Roastery',
				origin: editOrigin || 'Unknown Origin',
				roastLevel: (editRoastLevel as 'Light' | 'Medium' | 'Medium-Dark' | 'Dark') || undefined,
				tags: tags.length ? tags : selectedBean.tags,
				dose: editDose,
				yield: editYield,
				time: editTime,
				status: editStatus,
				roastDate: editRoastDate || undefined
			});
			selectedBean = updated;
			editMode = false;
			showToast('Bean updated', 'check_circle');
		} catch {
			showToast('Failed to update bean — check your connection', 'error');
		} finally {
			savingEdit = false;
		}
	}

	// ── Add-bean form state ──
	let newName = $state('');
	let newRoastery = $state('');
	let newOrigin = $state('');
	let newRoastLevel = $state<'Light' | 'Medium' | 'Medium-Dark' | 'Dark' | ''>('');
	let newTagsStr = $state('');
	let newDose = $state('18g');
	let newYield = $state('36g');
	let newTime = $state('30s');
	let newStatus = $state<'Fresh' | 'Peak' | 'Past Peak'>('Fresh');
	let newRoastDate = $state('');

	const coffeeImgs = [
		'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&auto=format&fit=crop&q=85',
		'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&auto=format&fit=crop&q=85',
		'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=400&auto=format&fit=crop&q=85',
		'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&auto=format&fit=crop&q=85'
	];

	async function addBean() {
		if (!newName.trim() || savingBean) return;
		savingBean = true;
		const tags = newTagsStr
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		try {
			const result = await beans.add({
				name: newName,
				roastery: newRoastery || 'Unknown Roastery',
				origin: newOrigin || 'Unknown Origin',
				roastLevel: (newRoastLevel as 'Light' | 'Medium' | 'Medium-Dark' | 'Dark') || undefined,
				tags: tags.length ? tags : ['Single Origin'],
				dose: newDose,
				yield: newYield,
				time: newTime,
				status: newStatus,
				roastDate: newRoastDate || undefined,
				img: coffeeImgs[Math.floor(Math.random() * coffeeImgs.length)],
				favorited: false
			});
			showToast(`Bean added! +${result.xpAwarded} XP`, 'check_circle');
			newName = '';
			newRoastery = '';
			newOrigin = '';
			newRoastLevel = '';
			newTagsStr = '';
			newDose = '18g';
			newYield = '36g';
			newTime = '30s';
			newStatus = 'Fresh';
			newRoastDate = '';
			showAddForm = false;
		} catch {
			showToast('Failed to add bean — check your connection', 'error');
		} finally {
			savingBean = false;
		}
	}

	const drawerOpen = $derived(selectedBean !== null || showAddForm);
	const rec = $derived(selectedBean ? getRecommendation(selectedBean.name) : null);
	const selectedBeanShotCount = $derived(selectedBean ? $shots.filter((s) => s.bean === selectedBean.name).length : 0);
</script>

<svelte:head>
	<title>Bean Library | Beanery</title>
</svelte:head>

<ConfirmModal
	open={confirmOpen}
	title="Remove this bean?"
	message={pendingRemove ? `Remove "${pendingRemove.name}" from your library? Your logged shots will remain in your journal.` : ''}
	confirmLabel="Remove"
	onconfirm={confirmRemove}
	oncancel={() => { confirmOpen = false; pendingRemove = null; }}
/>

<!-- ── QR Code Modal ── -->
{#if qrBean}
	<button
		class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
		onclick={() => { qrBean = null; qrDataUrl = ''; }}
		aria-label="Close QR modal"
		style="animation: fadeIn 0.2s ease-out"
	></button>
	<div
		class="fixed left-1/2 top-1/2 z-[61] w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface shadow-2xl"
		style="animation: modalIn 0.28s cubic-bezier(0.22,1,0.36,1)"
	>
		<div class="border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
			<div>
				<p class="text-label-caps text-crema-gold">QR Code</p>
				<h3 class="text-headline-md leading-tight">{qrBean.name}</h3>
			</div>
			<button onclick={() => { qrBean = null; qrDataUrl = ''; }} class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high active:scale-95">
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>
		</div>
		<div class="flex flex-col items-center gap-5 p-6">
			{#if qrDataUrl}
				<img src={qrDataUrl} alt="QR code for {qrBean.name}" class="rounded-xl" width="280" height="280" />
			{:else}
				<div class="flex h-[280px] w-[280px] items-center justify-center rounded-xl bg-surface-container-low">
					<span class="material-symbols-outlined animate-spin text-crema-gold text-[36px]">autorenew</span>
				</div>
			{/if}
			<p class="text-center text-label-caps text-on-surface-variant/50 px-4">Scan to open this bean's page in Beanery</p>
			<button
				onclick={downloadQR}
				class="flex w-full items-center justify-center gap-2 rounded-full bg-crema-gold py-3.5 text-label-caps text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
			>
				<span class="material-symbols-outlined text-[18px]">download</span>
				Download QR Code
			</button>
		</div>
	</div>
{/if}

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
		{#if !editMode}
			<!-- ── VIEW MODE ── -->
			{@const df = getFreshness(selectedBean.roastDate, selectedBean.status)}
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
					<span class="material-symbols-outlined text-[12px]" style="color:{df.color};font-variation-settings:'FILL' 1">{df.icon}</span>
					<span class="text-label-caps text-white">{df.label}</span>
					{#if df.daysAgo !== null}
						<span class="text-label-caps text-white/60">· {df.daysAgo}d</span>
					{/if}
				</div>
			</div>

			<div class="flex flex-1 flex-col p-7">
				<div class="mb-5 flex items-start justify-between">
					<div>
						<h2 class="text-headline-lg leading-tight">{selectedBean.name}</h2>
						<p class="text-label-caps mt-1 text-on-surface-variant/70">{selectedBean.roastery} • {selectedBean.origin}</p>
						{#if df.daysAgo !== null}
							<p class="text-label-caps mt-1" style="color:{df.color}">{df.daysAgo} days since roast · {df.label}</p>
						{/if}
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
					{#if selectedBean.roastLevel}
						<span class="rounded bg-crema-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-crema-gold">{selectedBean.roastLevel} Roast</span>
					{/if}
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

				<!-- Recommendation Engine -->
				{#if rec}
					<div class="mb-6 rounded-xl border border-crema-gold/25 bg-crema-gold/5 p-5">
						<div class="mb-3 flex items-center gap-2">
							<span class="material-symbols-outlined text-crema-gold text-[18px]" style="font-variation-settings:'FILL' 1">auto_awesome</span>
							<p class="text-label-sm text-crema-gold uppercase">Brew Recommendation</p>
						</div>
						<p class="text-label-caps mb-3 text-on-surface-variant/60">Based on your {rec.totalShots} shots · top {Math.min(3, rec.totalShots)} rated</p>
						<div class="mb-3 grid grid-cols-3 gap-2 text-center">
							{#each [{ l: 'Dose', v: `${rec.avgDose}g` }, { l: 'Yield', v: `${rec.avgYield}g` }, { l: 'Time', v: `${rec.avgTime}s` }] as col}
								<div class="rounded-lg bg-crema-gold/10 py-2.5">
									<p class="text-label-caps text-crema-gold/70">{col.l}</p>
									<p class="font-display text-[17px] font-semibold text-crema-gold">{col.v}</p>
								</div>
							{/each}
						</div>
						<div class="flex items-center justify-between">
							<span class="font-mono text-[12px] text-on-surface-variant">Ratio 1:{rec.ratio} · {rec.avgTemp}°C</span>
							{#if rec.grind}
								<span class="font-mono text-[12px] text-crema-gold">Grind {rec.grind}</span>
							{/if}
						</div>
						<div class="mt-3 flex items-center gap-1.5 border-t border-crema-gold/15 pt-3">
							<span class="material-symbols-outlined text-crema-gold text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
							<span class="text-label-caps text-on-surface-variant/60">Best shot: {rec.best.bean.split(' ').slice(0,2).join(' ')} · {rec.best.date} · ★{rec.best.rating}</span>
						</div>
					</div>
				{:else if selectedBeanShotCount > 0}
					<div class="mb-6 rounded-xl border border-outline-variant/20 bg-surface-container p-4">
						<p class="text-label-caps text-on-surface-variant/50">Log {3 - selectedBeanShotCount} more shot{3 - selectedBeanShotCount > 1 ? 's' : ''} with this bean to unlock brew recommendations</p>
					</div>
				{/if}

				<div class="mt-auto space-y-3">
					<button
						onclick={startEdit}
						class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full border border-crema-gold/30 py-3 text-crema-gold uppercase tracking-widest transition-all hover:bg-crema-gold/5 active:scale-95"
					>
						<span class="material-symbols-outlined text-[18px]">edit</span>
						Edit Bean
					</button>
					<a
						href="/shot-logger"
						class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full bg-crema-gold py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
					>
						<span class="material-symbols-outlined text-[18px]">biotech</span>
						Log Shot with This Bean
					</a>
					<button
						onclick={() => requestRemove(selectedBean!.id, selectedBean!.name)}
						class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full border border-error/20 py-3 text-error uppercase tracking-widest transition-all hover:bg-error/5 active:scale-95"
					>
						<span class="material-symbols-outlined text-[18px]">delete</span>
						Remove from Library
					</button>
				</div>
			</div>

		{:else}
			<!-- ── EDIT MODE ── -->
			<div class="flex items-center justify-between border-b border-outline-variant/10 px-7 py-5">
				<div>
					<h2 class="text-headline-md">Edit Bean</h2>
					<p class="text-label-caps mt-0.5 text-crema-gold">Update the details</p>
				</div>
				<button onclick={() => (editMode = false)} class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95" aria-label="Cancel edit">
					<span class="material-symbols-outlined text-[20px]">close</span>
				</button>
			</div>

			<form class="flex-1 space-y-5 p-7" onsubmit={(e) => { e.preventDefault(); saveEdit(); }}>
				<div>
					<label for="edit-name" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Bean Name *</label>
					<input id="edit-name" type="text" bind:value={editName} required
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="edit-roastery" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Roastery</label>
						<input id="edit-roastery" type="text" bind:value={editRoastery}
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
					</div>
					<div>
						<label for="edit-origin" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Origin</label>
						<input id="edit-origin" type="text" bind:value={editOrigin}
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
					</div>
				</div>
				<div>
					<label for="edit-roast-level" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Roast Level</label>
					<select id="edit-roast-level" bind:value={editRoastLevel}
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50">
						<option value="">— Not specified —</option>
						<option value="Light">Light</option>
						<option value="Medium">Medium</option>
						<option value="Medium-Dark">Medium-Dark</option>
						<option value="Dark">Dark</option>
					</select>
				</div>
				<div>
					<label for="edit-tags" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Flavor Tags</label>
					<input id="edit-tags" type="text" bind:value={editTagsStr}
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
					<p class="text-label-caps mt-1.5 text-on-surface-variant/40">Separate with commas</p>
				</div>

				<div>
					<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Sweet Spot Settings</p>
					<div class="grid grid-cols-3 gap-3">
						<div>
							<label for="edit-dose" class="text-label-caps mb-1.5 block text-on-surface-variant/60">Dose</label>
							<input id="edit-dose" type="text" bind:value={editDose}
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-center outline-none focus:ring-2 focus:ring-crema-gold/60" />
						</div>
						<div>
							<label for="edit-yield" class="text-label-caps mb-1.5 block text-on-surface-variant/60">Yield</label>
							<input id="edit-yield" type="text" bind:value={editYield}
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-center outline-none focus:ring-2 focus:ring-crema-gold/60" />
						</div>
						<div>
							<label for="edit-time" class="text-label-caps mb-1.5 block text-on-surface-variant/60">Time</label>
							<input id="edit-time" type="text" bind:value={editTime}
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-center outline-none focus:ring-2 focus:ring-crema-gold/60" />
						</div>
					</div>
				</div>

				<div>
					<label for="edit-roast-date" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Roast Date</label>
					<input id="edit-roast-date" type="date" bind:value={editRoastDate}
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
					{#if editRoastDate}
						{@const preview = getFreshness(editRoastDate)}
						<p class="text-label-caps mt-1.5" style="color:{preview.color}">{preview.label}{preview.daysAgo !== null ? ` · ${preview.daysAgo}d ago` : ''}</p>
					{:else}
						<p class="text-label-caps mt-1.5 text-on-surface-variant/40">Leave blank to set status manually</p>
					{/if}
				</div>

				{#if !editRoastDate}
					<div>
						<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Manual Status</p>
						<div class="flex gap-2">
							{#each (['Fresh', 'Peak', 'Past Peak'] as const) as s}
								<button type="button" onclick={() => (editStatus = s)}
									class="flex-1 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all {editStatus === s ? 'bg-crema-gold text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
									{s}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<div class="border-t border-outline-variant/10 pt-4 flex gap-3">
					<button type="button" onclick={() => (editMode = false)}
						class="text-label-caps flex-1 rounded-full border border-outline-variant/30 py-3.5 text-on-surface-variant uppercase tracking-widest transition-all hover:bg-surface-container-high active:scale-95">
						Cancel
					</button>
					<button type="submit"
						class="text-label-caps flex flex-1 items-center justify-center gap-2 rounded-full bg-crema-gold py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-40"
						disabled={!editName.trim() || savingEdit}>
						{#if savingEdit}
							<span class="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
							Saving…
						{:else}
							<span class="material-symbols-outlined text-[18px]">check</span>
							Save Changes
						{/if}
					</button>
				</div>
			</form>
		{/if}
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
				<label for="new-roast-level" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Roast Level</label>
				<select id="new-roast-level" bind:value={newRoastLevel}
					class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50">
					<option value="">— Not specified —</option>
					<option value="Light">Light</option>
					<option value="Medium">Medium</option>
					<option value="Medium-Dark">Medium-Dark</option>
					<option value="Dark">Dark</option>
				</select>
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
				<label for="new-roast-date" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Roast Date</label>
				<input id="new-roast-date" type="date" bind:value={newRoastDate}
					class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-container-low p-3.5 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50" />
				{#if newRoastDate}
					{@const preview = getFreshness(newRoastDate)}
					<p class="text-label-caps mt-1.5" style="color:{preview.color}">{preview.label}{preview.daysAgo !== null ? ` · ${preview.daysAgo}d ago` : ''}</p>
				{:else}
					<p class="text-label-caps mt-1.5 text-on-surface-variant/40">Leave blank to set status manually</p>
				{/if}
			</div>

			{#if !newRoastDate}
				<div>
					<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Manual Status</p>
					<div class="flex gap-2">
						{#each (['Fresh', 'Peak', 'Past Peak'] as const) as s}
							<button type="button" onclick={() => (newStatus = s)}
								class="flex-1 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all {newStatus === s ? 'bg-crema-gold text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}">
								{s}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="border-t border-outline-variant/10 pt-4">
				<button type="submit"
					class="text-label-caps flex w-full items-center justify-center gap-2 rounded-full bg-crema-gold py-4 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-40"
					disabled={!newName.trim() || savingBean}>
					{#if savingBean}
						<span class="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
						Saving to Database…
					{:else}
						<span class="material-symbols-outlined text-[18px]">add</span>
						Add to Library
					{/if}
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
			<div class="relative w-full md:w-auto">
				<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
				<input type="text" placeholder="Search beans, origins..." bind:value={search}
					class="text-body-md w-full rounded-full border-none bg-surface-container py-3 pl-11 pr-5 outline-none ring-0 transition-all duration-300 focus:ring-1 focus:ring-crema-gold hover:bg-surface-container-high md:w-64" />
			</div>
		</header>

		<!-- Grid -->
		<div class="grid grid-cols-1 gap-stack-lg sm:grid-cols-2 xl:grid-cols-3">
			{#each filtered as bean (bean.id)}
				{@const freshness = getFreshness(bean.roastDate, bean.status)}
				<div
					class="group relative flex h-[490px] cursor-pointer flex-col overflow-hidden rounded-xl border border-primary/5 bg-surface-container-low transition-all duration-300 hover:-translate-y-1.5 hover:border-crema-gold/30 hover:shadow-xl"
					onclick={() => openBean(bean)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && openBean(bean)}
					use:reveal={0}
				>
					<div class="relative h-[240px] w-full flex-shrink-0 overflow-hidden">
						<BeanImage src={bean.img} alt={bean.name}
							class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" />
						<div class="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-bean-floral/75 px-3 py-1 backdrop-blur-sm">
							<span class="material-symbols-outlined text-[12px]" style="color:{freshness.color};font-variation-settings:'FILL' 1">{freshness.icon}</span>
							<span class="text-label-caps text-white">{freshness.label}</span>
						</div>
					</div>

					<div class="flex flex-1 flex-col justify-between p-6">
						<div>
							<div class="mb-2 flex items-start justify-between gap-2">
								<h3 class="text-headline-lg leading-tight transition-colors duration-200 group-hover:text-secondary">{bean.name}</h3>
								<div class="flex flex-shrink-0 items-center gap-1">
									<!-- QR button -->
									<button onclick={(e) => { e.stopPropagation(); openQR(bean); }}
										class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant/40 transition-all hover:bg-surface-container-high hover:text-crema-gold active:scale-90"
										aria-label="Show QR code">
										<span class="material-symbols-outlined text-[18px]">qr_code</span>
									</button>
									<!-- Favourite button -->
									<button onclick={(e) => { e.stopPropagation(); beans.toggleFav(bean.id); }}
										class="flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 hover:scale-110"
										aria-label="{bean.favorited ? 'Remove from' : 'Add to'} favourites">
										<span class="material-symbols-outlined text-[22px]"
											class:text-crema-gold={bean.favorited}
											class:text-on-surface-variant={!bean.favorited}
											style="font-variation-settings: 'FILL' {bean.favorited ? 1 : 0}, 'wght' 300"
										>favorite</span>
									</button>
								</div>
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
		{:else if $beans.length === 0}
			<div class="flex flex-col items-center rounded-xl border border-dashed border-outline-variant/40 py-20 text-center" use:reveal={0}>
				<span class="material-symbols-outlined mb-5 text-[52px] text-crema-gold/30">local_cafe</span>
				<h3 class="text-headline-md mb-2 text-on-surface-variant">Your library is empty</h3>
				<p class="text-body-md mb-8 text-on-surface-variant/60">Add your first bean to start tracking extractions.</p>
				<button
					onclick={() => { selectedBean = null; showAddForm = true; }}
					class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
				>
					<span class="material-symbols-outlined mr-2 text-[16px]">add</span>
					Add Your First Bean
				</button>
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
	@keyframes modalIn {
		from { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 14px)) scale(0.97); }
		to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
	}
</style>
