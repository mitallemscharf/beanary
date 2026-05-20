<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { shots } from '$lib/stores/shots';
	import { beans } from '$lib/stores/beans';
	import { showToast } from '$lib/stores/toast';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		showToast('Logged out — see you next time', 'logout');
		goto('/login');
	}

	// Profile prefs stored in localStorage
	const PREFS_KEY = 'beanery-prefs';
	function loadPrefs() {
		if (!browser) return { name: 'Lenny', email: 'lenny@beanery.com', defaultDose: 18, defaultTemp: 94 };
		const raw = localStorage.getItem(PREFS_KEY);
		return raw ? JSON.parse(raw) : { name: 'Lenny', email: 'lenny@beanery.com', defaultDose: 18, defaultTemp: 94 };
	}

	let prefs = $state(loadPrefs());

	function savePrefs() {
		if (browser) localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
		showToast('Preferences saved', 'check_circle');
	}

	function exportCSV() {
		const csv = [
			'Bean,Dose,Yield,Time,Temp,Rating,Date,Notes',
			...$shots.map((s) => `"${s.bean}",${s.dose},${s.yield},${s.time},${s.temp},${s.rating},"${s.date}","${s.notes}"`)
		].join('\n');
		const a = document.createElement('a');
		a.href = 'data:text/csv,' + encodeURIComponent(csv);
		a.download = 'beanery-shots.csv';
		a.click();
		showToast('Exported ' + $shots.length + ' shots', 'file_download');
	}

	let confirmReset = $state(false);
	let resetting = $state(false);

	async function resetData() {
		if (!confirmReset) {
			confirmReset = true;
			setTimeout(() => (confirmReset = false), 4000);
			return;
		}
		resetting = true;
		confirmReset = false;
		try {
			await Promise.all([shots.reset(), beans.reset()]);
			showToast('Data reset to defaults', 'restart_alt');
		} catch {
			showToast('Reset failed — try again', 'error');
		} finally {
			resetting = false;
		}
	}

	const sections = [
		{ label: 'Profile', icon: 'account_circle' },
		{ label: 'Extraction', icon: 'science' },
		{ label: 'Data', icon: 'database' }
	];
	let activeSection = $state('Profile');
</script>

<svelte:head>
	<title>Settings | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Header -->
		<header class="mb-12" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Preferences</p>
			<h1 class="text-headline-xl text-primary">Settings</h1>
			<p class="text-body-lg mt-2 text-on-surface-variant">Manage your profile and extraction defaults.</p>
		</header>

		<div class="grid grid-cols-1 gap-gutter lg:grid-cols-12">

			<!-- Section nav -->
			<nav class="lg:col-span-3" use:reveal={0}>
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-2">
					{#each sections as s}
						<button
							onclick={() => (activeSection = s.label)}
							class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200 {activeSection === s.label
								? 'border-l-4 border-crema-gold bg-primary-container text-on-primary-container font-semibold'
								: 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}"
						>
							<span class="material-symbols-outlined text-[18px]">{s.icon}</span>
							<span class="text-body-md">{s.label}</span>
						</button>
					{/each}
				</div>
			</nav>

			<!-- Section content -->
			<div class="lg:col-span-9" use:reveal={100}>

				{#if activeSection === 'Profile'}
					<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
						<h2 class="text-headline-md mb-8">Profile</h2>
						<div class="space-y-6">
							<div>
								<label for="pref-name" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Display Name</label>
								<input
									id="pref-name"
									type="text"
									bind:value={prefs.name}
									class="text-body-md w-full max-w-md rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
								/>
							</div>
							<div>
								<label for="pref-email" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Email</label>
								<input
									id="pref-email"
									type="email"
									bind:value={prefs.email}
									class="text-body-md w-full max-w-md rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
								/>
							</div>
							<div class="border-t border-outline-variant/10 pt-6 flex items-center justify-between">
								<button
									onclick={savePrefs}
									class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
								>
									Save Changes
								</button>
								<button
									onclick={logout}
									class="flex items-center gap-2 rounded-full border border-outline-variant/30 px-6 py-3 text-on-surface-variant/60 transition-all hover:border-error/30 hover:text-error active:scale-95"
								>
									<span class="material-symbols-outlined text-[18px]">logout</span>
									<span class="text-label-sm uppercase tracking-widest">Log Out</span>
								</button>
							</div>
						</div>
					</div>

				{:else if activeSection === 'Extraction'}
					<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
						<h2 class="text-headline-md mb-2">Extraction Defaults</h2>
						<p class="text-body-md mb-8 text-on-surface-variant">These values pre-fill the Shot Logger form.</p>
						<div class="space-y-8">
							<div>
								<label for="pref-dose" class="text-label-sm mb-3 flex items-center justify-between text-on-surface-variant uppercase">
									<span>Default Dose</span>
									<span class="text-headline-md text-crema-gold">{prefs.defaultDose}g</span>
								</label>
								<input
									id="pref-dose"
									type="range"
									min="14"
									max="22"
									step="0.5"
									bind:value={prefs.defaultDose}
									class="range-gold w-full max-w-md"
								/>
								<div class="mt-2 flex max-w-md justify-between">
									<span class="text-label-caps text-on-surface-variant/40">14g</span>
									<span class="text-label-caps text-on-surface-variant/40">22g</span>
								</div>
							</div>
							<div>
								<label for="pref-temp" class="text-label-sm mb-3 flex items-center justify-between text-on-surface-variant uppercase">
									<span>Default Water Temperature</span>
									<span class="text-headline-md text-crema-gold">{prefs.defaultTemp}°C</span>
								</label>
								<input
									id="pref-temp"
									type="range"
									min="85"
									max="100"
									bind:value={prefs.defaultTemp}
									class="range-gold w-full max-w-md"
								/>
								<div class="mt-2 flex max-w-md justify-between">
									<span class="text-label-caps text-on-surface-variant/40">85°C Cool</span>
									<span class="text-label-caps text-on-surface-variant/40">100°C Hot</span>
								</div>
							</div>
							<div class="border-t border-outline-variant/10 pt-6">
								<button
									onclick={savePrefs}
									class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
								>
									Save Defaults
								</button>
							</div>
						</div>
					</div>

				{:else if activeSection === 'Data'}
					<div class="space-y-4">
						<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
							<h2 class="text-headline-md mb-2">Export Data</h2>
							<p class="text-body-md mb-6 text-on-surface-variant">Download all your shot logs as a CSV file.</p>
							<button
								onclick={exportCSV}
								class="flex items-center gap-2.5 rounded-full border border-crema-gold/30 bg-crema-gold/5 px-6 py-3 text-crema-gold transition-all hover:bg-crema-gold/10 hover:shadow-sm active:scale-95"
							>
								<span class="material-symbols-outlined text-[18px]">file_download</span>
								<span class="text-label-sm uppercase tracking-widest">Export {$shots.length} Shots as CSV</span>
							</button>
						</div>

						<div class="rounded-xl border border-error/20 bg-surface-container-low p-8">
							<h2 class="text-headline-md mb-2">Reset Shot History</h2>
							<p class="text-body-md mb-6 text-on-surface-variant">
								Restores default sample data. This cannot be undone.
							</p>
							<button
								onclick={resetData}
								class="flex items-center gap-2.5 rounded-full px-6 py-3 transition-all active:scale-95 {confirmReset
									? 'bg-error text-white hover:bg-error/90'
									: 'border border-error/30 bg-error/5 text-error hover:bg-error/10'}"
							>
								<span class="material-symbols-outlined text-[18px]">{confirmReset ? 'warning' : 'restart_alt'}</span>
								<span class="text-label-sm uppercase tracking-widest">
									{confirmReset ? 'Tap again to confirm reset' : 'Reset to Defaults'}
								</span>
							</button>
						</div>
					</div>
				{/if}

			</div>
		</div>
	</div>
</div>
