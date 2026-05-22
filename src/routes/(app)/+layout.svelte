<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/stores/toast';
	import { shots } from '$lib/stores/shots';
	import { beans } from '$lib/stores/beans';
	import { darkMode } from '$lib/stores/theme';
	import OnboardingTour from '$lib/components/OnboardingTour.svelte';
	import type { PageData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: PageData } = $props();
	const user = $derived(data.user);

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		showToast('Logged out — see you next time', 'logout');
		goto('/login');
	}

	let dataLoaded = $state(false);
	let showOnboarding = $state(false);

	onMount(async () => {
		try {
			await Promise.all([shots.load(), beans.load()]);
		} catch {
			showToast('Could not connect to database', 'error');
		} finally {
			dataLoaded = true;
		}

		// Show onboarding tour for beginners who haven't completed it
		if (user?.skillLevel === 'beginner' && !user?.onboardingCompleted) {
			showOnboarding = true;
		}
	});

	async function completeOnboarding() {
		showOnboarding = false;
		await fetch('/api/users/profile', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ onboardingCompleted: true })
		});
	}

	const navItems = [
		{ href: '/dashboard',   icon: 'dashboard',     label: 'Dashboard' },
		{ href: '/shot-logger', icon: 'coffee',        label: 'Shot Logger' },
		{ href: '/history',     icon: 'menu_book',     label: 'Journal' },
		{ href: '/library',     icon: 'local_library', label: 'Library' },
		{ href: '/profile',     icon: 'workspace_premium', label: 'Profile' },
		{ href: '/settings',    icon: 'settings',      label: 'Settings' }
	];

	function isActive(href: string) {
		return $page.url.pathname === href;
	}

	// ── Global Search ──
	let searchOpen = $state(false);
	let searchQuery = $state('');
	let searchInput: HTMLInputElement | undefined = $state();

	function openSearch() {
		searchOpen = true;
		searchQuery = '';
	}

	function closeSearch() {
		searchOpen = false;
		searchQuery = '';
	}

	function handleSearchKey(e: KeyboardEvent) {
		if (e.key === 'Escape') closeSearch();
	}

	const shotResults = $derived(
		searchQuery.trim().length >= 1
			? $shots
					.filter(
						(s) =>
							s.bean.toLowerCase().includes(searchQuery.toLowerCase()) ||
							s.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
							s.process.toLowerCase().includes(searchQuery.toLowerCase())
					)
					.slice(0, 5)
			: $shots.slice(0, 3)
	);

	const beanResults = $derived(
		searchQuery.trim().length >= 1
			? $beans
					.filter(
						(b) =>
							b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							b.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
							b.roastery.toLowerCase().includes(searchQuery.toLowerCase()) ||
							b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
					)
					.slice(0, 4)
			: $beans.slice(0, 2)
	);

	const hasResults = $derived(shotResults.length > 0 || beanResults.length > 0);
	const isFiltering = $derived(searchQuery.trim().length >= 1);
</script>

<!-- Onboarding Tour -->
{#if showOnboarding}
	<OnboardingTour onComplete={completeOnboarding} />
{/if}

<!-- Grain texture overlay -->
<div class="grain-texture" aria-hidden="true"></div>

<!-- ── Data loading indicator ── -->
{#if !dataLoaded}
	<div class="fixed inset-0 z-[300] flex items-center justify-center bg-surface/80 backdrop-blur-sm" style="animation: fadeIn 0.3s ease-out">
		<div class="flex flex-col items-center gap-4">
			<span class="material-symbols-outlined animate-spin text-crema-gold text-[40px]">coffee_maker</span>
			<p class="text-label-caps text-on-surface-variant">Loading your laboratory…</p>
		</div>
	</div>
{/if}

<!-- ── Global Search Overlay ── -->
{#if searchOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm"
		onclick={closeSearch}
		onkeydown={handleSearchKey}
	></div>

	<div
		class="fixed left-1/2 top-20 z-[201] w-full max-w-2xl -translate-x-1/2 px-4"
		style="animation: searchDrop 0.22s cubic-bezier(0.22,1,0.36,1)"
	>
		<div class="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface shadow-2xl">
			<!-- Search input row -->
			<div class="flex items-center gap-3 border-b border-outline-variant/10 px-5 py-4">
				<span class="material-symbols-outlined flex-shrink-0 text-crema-gold text-[20px]">search</span>
				<input
					bind:this={searchInput}
					bind:value={searchQuery}
					onkeydown={handleSearchKey}
					placeholder="Search shots, beans, flavors…"
					autofocus
					class="text-body-lg flex-1 bg-transparent outline-none placeholder:text-on-surface-variant/40"
				/>
				{#if searchQuery}
					<button onclick={() => (searchQuery = '')} class="flex-shrink-0 text-on-surface-variant/50 hover:text-on-surface active:scale-90">
						<span class="material-symbols-outlined text-[18px]">close</span>
					</button>
				{/if}
				<kbd class="hidden rounded border border-outline-variant/30 px-1.5 py-0.5 text-[10px] text-on-surface-variant/40 sm:block">Esc</kbd>
			</div>

			<!-- Results -->
			<div class="max-h-[65vh] overflow-y-auto">
				{#if isFiltering && !hasResults}
					<div class="flex flex-col items-center py-12 text-center">
						<span class="material-symbols-outlined mb-3 text-[40px] text-crema-gold/30">search_off</span>
						<p class="text-body-md text-on-surface-variant">No results for "<em>{searchQuery}</em>"</p>
					</div>
				{:else}
					{#if shotResults.length > 0}
						<div class="px-3 pt-4 pb-1">
							<p class="text-label-caps px-2 pb-2 text-crema-gold">
								{isFiltering ? 'Matching Shots' : 'Recent Shots'}
							</p>
							{#each shotResults as shot}
								<a
									href="/history"
									onclick={closeSearch}
									class="flex items-center gap-4 rounded-xl px-3 py-3 transition-all hover:bg-surface-container-low active:scale-[0.99]"
								>
									<img src={shot.img} alt={shot.bean} class="h-11 w-11 flex-shrink-0 rounded-lg object-cover grayscale" />
									<div class="min-w-0 flex-1">
										<p class="text-body-md font-semibold truncate">{shot.bean}</p>
										<p class="text-label-caps text-on-surface-variant/60">{shot.process} · {shot.time}s · {shot.date}</p>
									</div>
									<div class="flex flex-shrink-0 gap-0.5">
										{#each Array.from({ length: 5 }) as _, i}
											<span class="material-symbols-outlined text-[13px]"
												class:text-crema-gold={i < shot.rating}
												class:text-outline-variant={i >= shot.rating}
												style="font-variation-settings: 'FILL' {i < shot.rating ? 1 : 0}"
											>star</span>
										{/each}
									</div>
								</a>
							{/each}
						</div>
					{/if}

					{#if beanResults.length > 0}
						<div class="px-3 pb-4 pt-2">
							<p class="text-label-caps px-2 pb-2 text-crema-gold">
								{isFiltering ? 'Matching Beans' : 'Your Beans'}
							</p>
							{#each beanResults as bean}
								<a
									href="/library"
									onclick={closeSearch}
									class="flex items-center gap-4 rounded-xl px-3 py-3 transition-all hover:bg-surface-container-low active:scale-[0.99]"
								>
									<img src={bean.img} alt={bean.name} class="h-11 w-11 flex-shrink-0 rounded-lg object-cover grayscale" />
									<div class="min-w-0 flex-1">
										<p class="text-body-md font-semibold truncate">{bean.name}</p>
										<p class="text-label-caps text-on-surface-variant/60">{bean.roastery} · {bean.origin} · {bean.status}</p>
									</div>
									<div class="flex flex-shrink-0 flex-wrap gap-1">
										{#each bean.tags.slice(0, 2) as tag}
											<span class="rounded bg-secondary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-secondary">{tag}</span>
										{/each}
									</div>
								</a>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Top App Bar -->
<header class="sticky top-0 z-50 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-md">
	<div class="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 md:px-margin-desktop">
		<div class="flex items-center gap-12">
			<a href="/" class="text-headline-md font-display tracking-[0.12em] text-crema-gold uppercase transition-opacity duration-300 hover:opacity-75">
				Beanery
			</a>
			<nav class="hidden items-center gap-8 md:flex">
				{#each [{ href: '/dashboard', label: 'Lab' }, { href: '/history', label: 'Journal' }, { href: '/library', label: 'Library' }] as link}
					<a
						href={link.href}
						class="text-label-sm transition-colors duration-200 {$page.url.pathname === link.href ? 'border-b-2 border-crema-gold pb-0.5 text-crema-gold' : 'text-on-surface-variant hover:text-crema-gold'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>

		<div class="flex items-center gap-3">
			<!-- Search bar -->
			<button
				onclick={openSearch}
				class="relative hidden items-center gap-2 rounded-full bg-surface-container py-2.5 pl-4 pr-5 text-on-surface-variant/60 transition-all duration-200 hover:bg-surface-container-high hover:text-on-surface-variant sm:flex"
				aria-label="Open search"
			>
				<span class="material-symbols-outlined text-[18px]">search</span>
				<span class="text-[13px]">Search logs…</span>
				<kbd class="ml-2 rounded border border-outline-variant/30 px-1.5 py-0.5 text-[10px] opacity-60">/</kbd>
			</button>
			<button
				onclick={() => showToast('No new notifications', 'notifications')}
				class="rounded-full p-2.5 text-on-surface-variant transition-all duration-200 hover:bg-surface-container-high hover:text-crema-gold active:scale-95"
				aria-label="Notifications"
			>
				<span class="material-symbols-outlined text-[22px]">notifications</span>
			</button>
			<button
				onclick={() => goto('/settings')}
				class="rounded-full p-2.5 transition-all duration-200 hover:bg-surface-container-high active:scale-95 {$page.url.pathname === '/settings' ? 'text-crema-gold' : 'text-on-surface-variant hover:text-crema-gold'}"
				aria-label="Account settings"
			>
				<span class="material-symbols-outlined text-[22px]">account_circle</span>
			</button>
		</div>
	</div>
</header>

<div class="flex min-h-[calc(100vh-80px)]">
	<!-- Sidebar -->
	<aside
		class="hidden h-[calc(100vh-80px)] w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low md:flex"
		style="position: sticky; top: 80px;"
	>
		<div class="border-b border-outline-variant/10 px-6 py-5">
			<div class="flex items-center gap-3">
				<div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
					<span class="material-symbols-outlined text-crema-gold text-[18px]">person</span>
				</div>
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<p class="text-body-md truncate font-semibold leading-tight">{user?.name ?? 'Guest'}</p>
						{#if user?.role === 'admin'}
							<span class="flex-shrink-0 rounded bg-crema-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Admin</span>
						{/if}
					</div>
					<p class="text-label-caps truncate text-on-surface-variant/50">{user?.email ?? ''}</p>
				</div>
			</div>
		</div>

		<nav class="flex-1 px-3 py-4">
			{#each navItems as item}
				<a
					href={item.href}
					class="group flex items-center gap-4 rounded-r-lg px-4 py-3 transition-all duration-200 {isActive(item.href) ? 'border-l-4 border-crema-gold bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}"
				>
					<span
						class="material-symbols-outlined text-[20px] transition-transform duration-200 {isActive(item.href) ? '' : 'group-hover:scale-110'}"
						style={isActive(item.href) ? "font-variation-settings: 'FILL' 1, 'wght' 400" : ''}
					>{item.icon}</span>
					<span class="text-body-md">{item.label}</span>
				</a>
			{/each}

				<div class="my-2 border-t border-outline-variant/10"></div>
			<a href="/leaderboard"
				class="group flex items-center gap-4 rounded-r-lg px-4 py-3 transition-all duration-200 {isActive('/leaderboard') ? 'border-l-4 border-crema-gold bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}">
				<span class="material-symbols-outlined text-[20px] transition-transform duration-200 {isActive('/leaderboard') ? '' : 'group-hover:scale-110'}"
					style={isActive('/leaderboard') ? "font-variation-settings:'FILL' 1,'wght' 400" : ''}>leaderboard</span>
				<span class="text-body-md">Leaderboard</span>
			</a>
			<a href="/guides"
				class="group flex items-center gap-4 rounded-r-lg px-4 py-3 transition-all duration-200 {isActive('/guides') ? 'border-l-4 border-crema-gold bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}">
				<span class="material-symbols-outlined text-[20px] transition-transform duration-200 {isActive('/guides') ? '' : 'group-hover:scale-110'}"
					style={isActive('/guides') ? "font-variation-settings:'FILL' 1,'wght' 400" : ''}>menu_book</span>
				<span class="text-body-md">Brewing Guides</span>
			</a>
			<a href="/glossar"
				class="group flex items-center gap-4 rounded-r-lg px-4 py-3 transition-all duration-200 {isActive('/glossar') ? 'border-l-4 border-crema-gold bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}">
				<span class="material-symbols-outlined text-[20px] transition-transform duration-200 {isActive('/glossar') ? '' : 'group-hover:scale-110'}"
					style={isActive('/glossar') ? "font-variation-settings:'FILL' 1,'wght' 400" : ''}>dictionary</span>
				<span class="text-body-md">Glossar</span>
			</a>

		{#if user?.role === 'admin'}
				<div class="my-2 border-t border-outline-variant/10"></div>
				<a
					href="/admin"
					class="group flex items-center gap-4 rounded-r-lg px-4 py-3 transition-all duration-200 {isActive('/admin') ? 'border-l-4 border-crema-gold bg-primary-container text-on-primary-container font-semibold' : 'text-crema-gold/70 hover:bg-crema-gold/5 hover:text-crema-gold'}"
				>
					<span class="material-symbols-outlined text-[20px] transition-transform duration-200 {isActive('/admin') ? '' : 'group-hover:scale-110'}"
						style={isActive('/admin') ? "font-variation-settings: 'FILL' 1, 'wght' 400" : ''}>
						admin_panel_settings
					</span>
					<span class="text-body-md">Admin Panel</span>
				</a>
			{/if}
		</nav>

		<div class="border-t border-outline-variant/10 px-4 py-6">
			<a
				href="/shot-logger"
				class="text-label-sm mb-6 block w-full rounded-full bg-crema-gold py-3 text-center text-white uppercase tracking-widest shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95"
			>
				Start New Brew
			</a>
			<a
				href="mailto:lenny.frei@hotmail.com?subject=Beanery Support"
				class="text-label-sm flex items-center gap-3 px-2 py-2 text-on-surface-variant transition-colors hover:text-crema-gold"
			>
				<span class="material-symbols-outlined text-[18px]">help_outline</span>Support
			</a>
			<button
				onclick={() => darkMode.update((v) => !v)}
				class="text-label-sm mt-1 flex w-full items-center gap-3 px-2 py-2 text-on-surface-variant/60 transition-colors hover:text-crema-gold"
			>
				<span class="material-symbols-outlined text-[18px]">{$darkMode ? 'light_mode' : 'dark_mode'}</span>
				{$darkMode ? 'Light Mode' : 'Dark Mode'}
			</button>
			<button
				onclick={logout}
				class="text-label-sm mt-1 flex w-full items-center gap-3 px-2 py-2 text-on-surface-variant/60 transition-colors hover:text-error"
			>
				<span class="material-symbols-outlined text-[18px]">logout</span>Log Out
			</button>
		</div>
	</aside>

	<main class="min-h-full w-full flex-1 overflow-x-hidden">
		{@render children()}
	</main>
</div>

<!-- Mobile Bottom Navigation -->
<nav class="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant/20 bg-surface/95 backdrop-blur-md md:hidden">
	{#each [
		{ href: '/dashboard', icon: 'dashboard', label: 'Lab' },
		{ href: '/shot-logger', icon: 'coffee', label: 'Logger' },
		{ href: '/history', icon: 'menu_book', label: 'Journal' },
		{ href: '/library', icon: 'local_library', label: 'Library' },
		{ href: '/settings', icon: 'settings', label: 'Settings' }
	] as item}
		<a
			href={item.href}
			class="flex min-h-[48px] min-w-[52px] flex-col items-center justify-center gap-0.5 {$page.url.pathname === item.href ? 'text-crema-gold' : 'text-on-surface-variant'}"
		>
			<span class="material-symbols-outlined text-[22px]" style={$page.url.pathname === item.href ? "font-variation-settings: 'FILL' 1" : ''}>{item.icon}</span>
			<span class="text-label-caps text-[9px]">{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	@keyframes searchDrop {
		from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.98); }
		to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
	}
</style>
