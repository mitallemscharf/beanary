<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { shots } from '$lib/stores/shots';
	import { beans } from '$lib/stores/beans';
	import { showToast } from '$lib/stores/toast';
	import { darkMode } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const user = $derived(data.user);

	// ── Profile ──
	let displayName = $state(data.user?.name ?? '');
	let savingName = $state(false);

	async function saveName() {
		if (!displayName.trim()) return;
		savingName = true;
		try {
			const res = await fetch('/api/users/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: displayName.trim() })
			});
			if (res.ok) {
				showToast('Profile updated successfully', 'check_circle');
				await invalidateAll();
			} else {
				showToast('Failed to save — try again', 'error');
			}
		} finally {
			savingName = false;
		}
	}

	// ── Password change ──
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let savingPassword = $state(false);
	let passwordError = $state('');

	async function changePassword() {
		passwordError = '';
		if (!currentPassword || !newPassword || !confirmPassword) {
			passwordError = 'Please fill in all password fields.';
			return;
		}
		if (newPassword.length < 6) {
			passwordError = 'New password must be at least 6 characters.';
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordError = 'New passwords do not match.';
			return;
		}
		savingPassword = true;
		try {
			const res = await fetch('/api/users/password', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentPassword, newPassword })
			});
			if (res.ok) {
				showToast('Password updated', 'check_circle');
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			} else {
				const d = await res.json().catch(() => ({}));
				passwordError = d.message ?? 'Current password is incorrect.';
			}
		} finally {
			savingPassword = false;
		}
	}

	// ── Logout ──
	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		showToast('Logged out — see you next time', 'logout');
		goto('/login');
	}

	// ── Account deletion ──
	let deleteConfirmText = $state('');
	let deletingAccount = $state(false);

	async function deleteAccount() {
		if (deleteConfirmText !== 'DELETE') {
			showToast('Type DELETE to confirm', 'error');
			return;
		}
		deletingAccount = true;
		try {
			const res = await fetch('/api/users/account', { method: 'DELETE' });
			if (res.ok) {
				showToast('Account deleted', 'delete');
				goto('/login');
			} else {
				showToast('Deletion failed — try again', 'error');
			}
		} finally {
			deletingAccount = false;
		}
	}

	// ── Skill & Machine ──
	let skillLevel = $state(user?.skillLevel ?? 'home_barista');
	let machineType = $state(user?.machineType ?? 'espresso_semi');
	let savingProfile = $state(false);

	const SKILLS = [
		{ id: 'beginner',     emoji: '🌱', label: 'Beginner' },
		{ id: 'home_barista', emoji: '☕', label: 'Home Barista' },
		{ id: 'expert',       emoji: '🏆', label: 'Expert' }
	];
	const MACHINES = [
		{ id: 'espresso_semi', label: 'Espresso (Semi-Auto)' },
		{ id: 'espresso_auto', label: 'Espresso (Auto/Smart)' },
		{ id: 'pour_over',     label: 'Pour Over' },
		{ id: 'aeropress',     label: 'AeroPress' },
		{ id: 'french_press',  label: 'French Press' },
		{ id: 'moka_pot',      label: 'Moka Pot' },
		{ id: 'cold_brew',     label: 'Cold Brew' },
		{ id: 'other',         label: 'Multiple / Other' }
	];

	async function saveProfile() {
		savingProfile = true;
		try {
			const res = await fetch('/api/users/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ skillLevel, machineType })
			});
			if (res.ok) {
				showToast('Experience settings saved', 'check_circle');
				await invalidateAll();
			} else {
				showToast('Failed to save — try again', 'error');
			}
		} finally {
			savingProfile = false;
		}
	}

	// ── Extraction defaults ──
	let defaultDose  = $state(data.user?.defaultDose  ?? 18);
	let defaultYield = $state(data.user?.defaultYield ?? 36);
	let defaultTemp  = $state(data.user?.defaultTemp  ?? 94);
	let defaultGrind = $state(data.user?.defaultGrind ?? 15);
	let savingExtraction = $state(false);

	async function saveExtractionDefaults() {
		savingExtraction = true;
		try {
			const res = await fetch('/api/users/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ defaultDose, defaultYield, defaultTemp, defaultGrind })
			});
			if (res.ok) {
				showToast('Extraction defaults saved', 'check_circle');
				await invalidateAll();
			} else {
				showToast('Failed to save — try again', 'error');
			}
		} finally {
			savingExtraction = false;
		}
	}

	// ── Notifications ──
	let notifDailyReminder = $state(data.user?.notifications?.dailyReminder ?? false);
	let notifWeeklySummary = $state(data.user?.notifications?.weeklySummary ?? false);
	let notifBeanAlerts    = $state(data.user?.notifications?.beanFreshnessAlerts ?? false);
	let savingNotifs = $state(false);

	async function saveNotifications() {
		savingNotifs = true;
		try {
			const res = await fetch('/api/users/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notifications: { dailyReminder: notifDailyReminder, weeklySummary: notifWeeklySummary, beanFreshnessAlerts: notifBeanAlerts } })
			});
			if (res.ok) {
				showToast('Notification preferences saved', 'check_circle');
			} else {
				showToast('Failed to save — try again', 'error');
			}
		} finally {
			savingNotifs = false;
		}
	}

	// ── Data ──
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
		{ label: 'Profile',        icon: 'account_circle' },
		{ label: 'Experience',     icon: 'school' },
		{ label: 'Extraction',     icon: 'science' },
		{ label: 'Notifications',  icon: 'notifications' },
		{ label: 'Appearance',     icon: 'palette' },
		{ label: 'Data',           icon: 'database' },
		{ label: 'Delete Account', icon: 'delete_forever' }
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

				<!-- ── Profile ── -->
				{#if activeSection === 'Profile'}
					<div class="space-y-6">
						<!-- Name + email -->
						<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
							<h2 class="text-headline-md mb-8">Profile</h2>
							<div class="space-y-6">
								<!-- Display Name -->
								<div>
									<label for="pref-name" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Display Name</label>
									<div class="flex max-w-md gap-3">
										<input
											id="pref-name"
											type="text"
											bind:value={displayName}
											class="text-body-md flex-1 rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
										/>
										<button
											onclick={saveName}
											disabled={savingName}
											class="text-label-caps rounded-full bg-crema-gold px-6 py-3 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-md active:scale-95 disabled:opacity-60"
										>
											{savingName ? 'Saving…' : 'Save'}
										</button>
									</div>
								</div>

								<!-- Email — read-only -->
								<div>
									<p class="text-label-sm mb-2 block text-on-surface-variant uppercase">Email</p>
									<div class="flex max-w-md items-center gap-3 rounded-lg border border-outline-variant/20 bg-surface-container p-4 opacity-60">
										<span class="material-symbols-outlined text-[18px] text-on-surface-variant" style="font-variation-settings: 'FILL' 0, 'wght' 300">lock</span>
										<span class="text-body-md text-on-surface-variant">{user?.email ?? ''}</span>
									</div>
								</div>

								<!-- Logout -->
								<div class="border-t border-outline-variant/10 pt-6">
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

						<!-- Change Password -->
						<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
							<h2 class="text-headline-md mb-2">Change Password</h2>
							<p class="text-body-md mb-6 text-on-surface-variant">Keep your account secure with a strong password.</p>
							<div class="max-w-md space-y-4">
								<div>
									<label for="cur-pass" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Current Password</label>
									<input
										id="cur-pass"
										type="password"
										bind:value={currentPassword}
										autocomplete="current-password"
										class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
									/>
								</div>
								<div>
									<label for="new-pass" class="text-label-sm mb-2 block text-on-surface-variant uppercase">New Password</label>
									<input
										id="new-pass"
										type="password"
										bind:value={newPassword}
										autocomplete="new-password"
										class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
									/>
								</div>
								<div>
									<label for="conf-pass" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Confirm New Password</label>
									<input
										id="conf-pass"
										type="password"
										bind:value={confirmPassword}
										autocomplete="new-password"
										class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/50"
									/>
								</div>
								{#if passwordError}
									<p class="text-label-sm text-error">{passwordError}</p>
								{/if}
								<button
									onclick={changePassword}
									disabled={savingPassword}
									class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-60"
								>
									{savingPassword ? 'Updating…' : 'Update Password'}
								</button>
							</div>
						</div>
					</div>

				<!-- ── Account ── -->
				{:else if activeSection === 'Delete Account'}
					<div class="rounded-xl border border-error/20 bg-surface-container-low p-8">
						<div class="mb-6 flex items-center gap-3">
							<span class="material-symbols-outlined text-[24px] text-error">warning</span>
							<h2 class="text-headline-md text-error">Danger Zone</h2>
						</div>
						<p class="text-body-md mb-2 text-on-surface-variant">
							Permanently delete your account and all associated data. This includes every shot log, bean in your library, and your profile. <strong class="text-on-surface">This cannot be undone.</strong>
						</p>
						<p class="text-body-md mb-8 text-on-surface-variant">
							To confirm, type <span class="font-mono font-bold text-error">DELETE</span> in the field below.
						</p>
						<div class="max-w-sm space-y-4">
							<input
								type="text"
								bind:value={deleteConfirmText}
								placeholder="DELETE"
								class="text-body-md w-full rounded-lg border border-error/30 bg-surface-bright p-4 font-mono outline-none transition-colors focus:ring-2 focus:ring-error/40 placeholder:text-on-surface-variant/30"
							/>
							<button
								onclick={deleteAccount}
								disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
								class="flex items-center gap-2 rounded-full bg-error px-8 py-3.5 text-white transition-all hover:bg-error/90 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<span class="material-symbols-outlined text-[18px]">delete_forever</span>
								<span class="text-label-caps uppercase tracking-widest">{deletingAccount ? 'Deleting…' : 'Delete My Account'}</span>
							</button>
						</div>
					</div>

				<!-- ── Experience ── -->
				{:else if activeSection === 'Experience'}
					<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
						<h2 class="text-headline-md mb-2">Experience & Machine</h2>
						<p class="text-body-md mb-8 text-on-surface-variant">Personalises your Shot Logger fields and onboarding experience.</p>
						<div class="space-y-8">
							<div>
								<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Experience Level</p>
								<div class="flex flex-wrap gap-3">
									{#each SKILLS as s}
										<button type="button" onclick={() => (skillLevel = s.id)}
											class="flex items-center gap-2 rounded-full border-2 px-5 py-2.5 transition-all duration-200 active:scale-95
												{skillLevel === s.id ? 'border-crema-gold bg-crema-gold/10 text-primary font-semibold' : 'border-outline-variant/30 text-on-surface-variant hover:border-crema-gold/40'}">
											<span>{s.emoji}</span>
											<span class="text-body-md">{s.label}</span>
										</button>
									{/each}
								</div>
							</div>
							<div>
								<p class="text-label-sm mb-3 text-on-surface-variant uppercase">Machine Type</p>
								<div class="grid grid-cols-2 gap-2 max-w-md">
									{#each MACHINES as m}
										<button type="button" onclick={() => (machineType = m.id)}
											class="rounded-xl border-2 px-4 py-3 text-left text-body-md transition-all duration-200 active:scale-[0.98]
												{machineType === m.id ? 'border-crema-gold bg-crema-gold/10 font-semibold text-primary' : 'border-outline-variant/20 text-on-surface-variant hover:border-crema-gold/30'}">
											{m.label}
										</button>
									{/each}
								</div>
							</div>
							<div class="border-t border-outline-variant/10 pt-6">
								<button onclick={saveProfile} disabled={savingProfile}
									class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-60">
									{savingProfile ? 'Saving…' : 'Save Changes'}
								</button>
							</div>
						</div>
					</div>

				<!-- ── Extraction ── -->
				{:else if activeSection === 'Extraction'}
					<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
						<h2 class="text-headline-md mb-2">Extraction Defaults</h2>
						<p class="text-body-md mb-8 text-on-surface-variant">These values pre-fill the Shot Logger form each time you open it.</p>
						<div class="space-y-8">
							<!-- Dose -->
							<div>
								<label for="pref-dose" class="text-label-sm mb-3 flex items-center gap-3 text-on-surface-variant uppercase">
									<span>Default Dose</span>
									<span class="rounded-full bg-crema-gold/10 px-2.5 py-0.5 font-mono text-[12px] font-semibold normal-case tracking-normal text-crema-gold">{defaultDose}g</span>
								</label>
								<input
									id="pref-dose"
									type="range"
									min="14"
									max="22"
									step="0.5"
									bind:value={defaultDose}
									class="range-gold w-full max-w-md"
								/>
								<div class="mt-2 flex max-w-md justify-between">
									<span class="text-label-caps text-on-surface-variant/40">14g</span>
									<span class="text-label-caps text-on-surface-variant/40">22g</span>
								</div>
							</div>

							<!-- Yield -->
							<div>
								<label for="pref-yield" class="text-label-sm mb-3 flex items-center gap-3 text-on-surface-variant uppercase">
									<span>Default Yield</span>
									<span class="rounded-full bg-crema-gold/10 px-2.5 py-0.5 font-mono text-[12px] font-semibold normal-case tracking-normal text-crema-gold">{defaultYield}g</span>
								</label>
								<input
									id="pref-yield"
									type="range"
									min="20"
									max="60"
									step="0.5"
									bind:value={defaultYield}
									class="range-gold w-full max-w-md"
								/>
								<div class="mt-2 flex max-w-md justify-between">
									<span class="text-label-caps text-on-surface-variant/40">20g</span>
									<span class="text-label-caps text-on-surface-variant/40">60g</span>
								</div>
							</div>

							<!-- Grind -->
							<div>
								<label for="pref-grind" class="text-label-sm mb-3 flex items-center gap-3 text-on-surface-variant uppercase">
									<span>Default Grind Size</span>
									<span class="rounded-full bg-crema-gold/10 px-2.5 py-0.5 font-mono text-[12px] font-semibold normal-case tracking-normal text-crema-gold">{defaultGrind} clicks</span>
								</label>
								<input
									id="pref-grind"
									type="range"
									min="1"
									max="40"
									step="0.5"
									bind:value={defaultGrind}
									class="range-gold w-full max-w-md"
								/>
								<div class="mt-2 flex max-w-md justify-between">
									<span class="text-label-caps text-on-surface-variant/40">1 (fine)</span>
									<span class="text-label-caps text-on-surface-variant/40">40 (coarse)</span>
								</div>
							</div>

							<!-- Temperature -->
							<div>
								<label for="pref-temp" class="text-label-sm mb-3 flex items-center gap-3 text-on-surface-variant uppercase">
									<span>Default Water Temperature</span>
									<span class="rounded-full bg-crema-gold/10 px-2.5 py-0.5 font-mono text-[12px] font-semibold normal-case tracking-normal text-crema-gold">{defaultTemp}°C</span>
								</label>
								<input
									id="pref-temp"
									type="range"
									min="85"
									max="100"
									bind:value={defaultTemp}
									class="range-gold w-full max-w-md"
								/>
								<div class="mt-2 flex max-w-md justify-between">
									<span class="text-label-caps text-on-surface-variant/40">85°C Cool</span>
									<span class="text-label-caps text-on-surface-variant/40">100°C Hot</span>
								</div>
							</div>

							<div class="border-t border-outline-variant/10 pt-6">
								<button onclick={saveExtractionDefaults} disabled={savingExtraction}
									class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-60">
									{savingExtraction ? 'Saving…' : 'Save Defaults'}
								</button>
							</div>
						</div>
					</div>

				<!-- ── Notifications ── -->
				{:else if activeSection === 'Notifications'}
					<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
						<h2 class="text-headline-md mb-2">Notifications</h2>
						<p class="text-body-md mb-8 text-on-surface-variant">Control which updates Beanery sends you.</p>
						<div class="space-y-4">

							<!-- Daily Reminder -->
							<div class="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container p-6">
								<div class="flex items-center gap-4">
									<div class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
										<span class="material-symbols-outlined text-[22px] text-crema-gold" style="font-variation-settings: 'FILL' 0, 'wght' 300">alarm</span>
									</div>
									<div>
										<p class="text-body-md font-semibold text-on-surface">Daily Reminder</p>
										<p class="text-label-sm text-on-surface-variant">Morning nudge to log your first shot of the day</p>
									</div>
								</div>
								<button
									onclick={() => (notifDailyReminder = !notifDailyReminder)}
									class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 active:scale-95 {notifDailyReminder ? 'bg-crema-gold' : 'bg-outline-variant/40'}"
									role="switch"
									aria-checked={notifDailyReminder}
								>
									<span class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 {notifDailyReminder ? 'translate-x-6' : 'translate-x-1'}"></span>
								</button>
							</div>

							<!-- Weekly Summary -->
							<div class="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container p-6">
								<div class="flex items-center gap-4">
									<div class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
										<span class="material-symbols-outlined text-[22px] text-crema-gold" style="font-variation-settings: 'FILL' 0, 'wght' 300">bar_chart</span>
									</div>
									<div>
										<p class="text-body-md font-semibold text-on-surface">Weekly Progress Summary</p>
										<p class="text-label-sm text-on-surface-variant">Insights on your extraction stats every Sunday</p>
									</div>
								</div>
								<button
									onclick={() => (notifWeeklySummary = !notifWeeklySummary)}
									class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 active:scale-95 {notifWeeklySummary ? 'bg-crema-gold' : 'bg-outline-variant/40'}"
									role="switch"
									aria-checked={notifWeeklySummary}
								>
									<span class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 {notifWeeklySummary ? 'translate-x-6' : 'translate-x-1'}"></span>
								</button>
							</div>

							<!-- Bean Freshness Alerts -->
							<div class="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container p-6">
								<div class="flex items-center gap-4">
									<div class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
										<span class="material-symbols-outlined text-[22px] text-crema-gold" style="font-variation-settings: 'FILL' 0, 'wght' 300">coffee</span>
									</div>
									<div>
										<p class="text-body-md font-semibold text-on-surface">Bean Freshness Alerts</p>
										<p class="text-label-sm text-on-surface-variant">Reminder when beans in your library are approaching peak or going stale</p>
									</div>
								</div>
								<button
									onclick={() => (notifBeanAlerts = !notifBeanAlerts)}
									class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 active:scale-95 {notifBeanAlerts ? 'bg-crema-gold' : 'bg-outline-variant/40'}"
									role="switch"
									aria-checked={notifBeanAlerts}
								>
									<span class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 {notifBeanAlerts ? 'translate-x-6' : 'translate-x-1'}"></span>
								</button>
							</div>

							<div class="pt-2">
								<button onclick={saveNotifications} disabled={savingNotifs}
									class="text-label-caps rounded-full bg-crema-gold px-8 py-3.5 text-white uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg active:scale-95 disabled:opacity-60">
									{savingNotifs ? 'Saving…' : 'Save Preferences'}
								</button>
							</div>
						</div>
					</div>

				<!-- ── Appearance ── -->
				{:else if activeSection === 'Appearance'}
					<div class="rounded-xl border border-primary/5 bg-surface-container-low p-8">
						<h2 class="text-headline-md mb-2">Appearance</h2>
						<p class="text-body-md mb-8 text-on-surface-variant">Customise how Beanery looks for you.</p>
						<div class="space-y-4">
							<div class="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container p-6">
								<div class="flex items-center gap-4">
									<div class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high">
										<span class="material-symbols-outlined text-[22px] text-crema-gold">{$darkMode ? 'dark_mode' : 'light_mode'}</span>
									</div>
									<div>
										<p class="text-body-md font-semibold text-on-surface">Dark Mode</p>
										<p class="text-label-sm text-on-surface-variant">{$darkMode ? 'Currently using dark theme' : 'Currently using light theme'}</p>
									</div>
								</div>
								<button
									onclick={() => darkMode.update((v) => !v)}
									class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 active:scale-95 {$darkMode ? 'bg-crema-gold' : 'bg-outline-variant/40'}"
									role="switch"
									aria-checked={$darkMode}
									aria-label="Toggle dark mode"
								>
									<span class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 {$darkMode ? 'translate-x-6' : 'translate-x-1'}"></span>
								</button>
							</div>
						</div>
					</div>

				<!-- ── Data ── -->
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
