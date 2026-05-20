<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/actions/reveal';
	import { showToast } from '$lib/stores/toast';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	interface UserRow {
		id: string;
		name: string;
		email: string;
		role: string;
		createdAt: string;
		beanCount: number;
		shotCount: number;
	}

	interface ActivityRow {
		id: string;
		bean: string;
		rating: number;
		time: number;
		img: string;
		date: string;
		userId: string;
		userName: string;
	}

	interface AdminStats {
		totalUsers: number;
		totalBeans: number;
		totalShots: number;
		users: UserRow[];
		activity: ActivityRow[];
	}

	let stats = $state<AdminStats | null>(null);
	let loading = $state(true);

	// Confirm modal
	let confirmOpen = $state(false);
	let pendingDelete = $state<{ type: 'user' | 'shot'; id: string; label: string } | null>(null);
	let deletingId = $state<string | null>(null);

	async function fetchStats() {
		loading = true;
		try {
			const res = await fetch('/api/admin/stats');
			if (res.ok) stats = await res.json();
		} finally {
			loading = false;
		}
	}

	onMount(fetchStats);

	function requestDelete(type: 'user' | 'shot', id: string, label: string) {
		pendingDelete = { type, id, label };
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!pendingDelete) return;
		const { type, id, label } = pendingDelete;
		confirmOpen = false;
		pendingDelete = null;
		deletingId = id;

		try {
			const res = await fetch('/api/admin/stats', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type, id })
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				showToast(d.message ?? 'Delete failed', 'error');
				return;
			}
			showToast(
				type === 'user' ? `User "${label}" removed` : `Shot deleted`,
				'delete'
			);
			await fetchStats();
		} catch {
			showToast('Delete failed — check connection', 'error');
		} finally {
			deletingId = null;
		}
	}

	function initial(name: string) {
		return name?.charAt(0).toUpperCase() ?? '?';
	}

	function formatDate(iso: string) {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Admin Panel | Beanery</title>
</svelte:head>

<ConfirmModal
	open={confirmOpen}
	title={pendingDelete?.type === 'user' ? 'Delete this user?' : 'Delete this shot?'}
	message={pendingDelete?.type === 'user'
		? `Remove user "${pendingDelete.label}" and all their beans and shots? This cannot be undone.`
		: `Delete the shot "${pendingDelete?.label}"? This cannot be undone.`}
	confirmLabel="Delete"
	danger={true}
	onconfirm={confirmDelete}
	oncancel={() => { confirmOpen = false; pendingDelete = null; }}
/>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Header -->
		<header class="mb-12" use:reveal={0}>
			<div class="mb-2 flex items-center gap-3">
				<p class="text-label-caps text-crema-gold">Administration</p>
				<span class="rounded bg-crema-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Admin Only</span>
			</div>
			<h1 class="text-headline-xl text-primary">Admin Panel</h1>
			<p class="text-body-lg mt-2 text-on-surface-variant">
				Full visibility across all users, beans, and extraction logs.
			</p>
		</header>

		{#if loading}
			<div class="flex items-center justify-center py-32">
				<span class="material-symbols-outlined animate-spin text-crema-gold text-[40px]">autorenew</span>
			</div>

		{:else if stats}

			<!-- ── Stat cards ── -->
			<div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3" use:reveal={0}>

				<!-- Total Users — dark card -->
				<div class="relative overflow-hidden rounded-xl bg-primary-container p-7">
					<div class="absolute right-5 top-5 opacity-10">
						<span class="material-symbols-outlined text-[64px] text-white" style="font-variation-settings: 'FILL' 1">group</span>
					</div>
					<p class="text-label-caps mb-1 text-on-primary-container/60">Registered Users</p>
					<p class="font-display text-[48px] font-bold leading-none text-crema-gold">{stats.totalUsers}</p>
					<p class="text-label-sm mt-2 text-on-primary-container/50">Active accounts</p>
				</div>

				<!-- Total Beans -->
				<div class="relative overflow-hidden rounded-xl border border-primary/5 bg-surface-container-low p-7">
					<div class="absolute right-5 top-5 opacity-5">
						<span class="material-symbols-outlined text-[64px]" style="font-variation-settings: 'FILL' 1">local_cafe</span>
					</div>
					<p class="text-label-caps mb-1 text-on-surface-variant/60">Total Beans</p>
					<p class="font-display text-[48px] font-bold leading-none text-crema-gold">{stats.totalBeans}</p>
					<p class="text-label-sm mt-2 text-on-surface-variant/40">Across all libraries</p>
				</div>

				<!-- Total Shots -->
				<div class="relative overflow-hidden rounded-xl border border-primary/5 bg-surface-container-low p-7">
					<div class="absolute right-5 top-5 opacity-5">
						<span class="material-symbols-outlined text-[64px]" style="font-variation-settings: 'FILL' 1">coffee</span>
					</div>
					<p class="text-label-caps mb-1 text-on-surface-variant/60">Total Shots Logged</p>
					<p class="font-display text-[48px] font-bold leading-none text-crema-gold">{stats.totalShots}</p>
					<p class="text-label-sm mt-2 text-on-surface-variant/40">Across all journals</p>
				</div>
			</div>

			<!-- ── Main grid: Users table + Activity ── -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">

				<!-- Users table (7 cols) -->
				<div class="lg:col-span-7" use:reveal={0}>
					<div class="rounded-xl border border-primary/5 bg-surface-container-low">
						<div class="flex items-center justify-between border-b border-outline-variant/10 px-7 py-5">
							<div>
								<h2 class="text-headline-md">Users</h2>
								<p class="text-label-caps mt-0.5 text-on-surface-variant/50">{stats.totalUsers} registered account{stats.totalUsers !== 1 ? 's' : ''}</p>
							</div>
							<span class="material-symbols-outlined text-crema-gold text-[22px]">group</span>
						</div>

						<div class="divide-y divide-outline-variant/10">
							{#each stats.users as u (u.id)}
								<div class="flex items-center gap-4 px-7 py-4 transition-colors hover:bg-surface-container {deletingId === u.id ? 'opacity-40' : ''}">

									<!-- Avatar -->
									<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white
										{u.role === 'admin' ? 'bg-crema-gold' : 'bg-on-surface-variant/40'}">
										{initial(u.name)}
									</div>

									<!-- Info -->
									<div class="min-w-0 flex-1">
										<div class="flex items-center gap-2">
											<p class="text-body-md truncate font-semibold">{u.name}</p>
											{#if u.role === 'admin'}
												<span class="flex-shrink-0 rounded bg-crema-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-crema-gold">Admin</span>
											{/if}
										</div>
										<p class="text-label-caps truncate text-on-surface-variant/50">{u.email}</p>
									</div>

									<!-- Counts -->
									<div class="hidden flex-shrink-0 items-center gap-5 sm:flex">
										<div class="text-center">
											<p class="font-display text-[20px] font-semibold text-crema-gold">{u.beanCount}</p>
											<p class="text-label-caps text-on-surface-variant/40">Beans</p>
										</div>
										<div class="text-center">
											<p class="font-display text-[20px] font-semibold text-crema-gold">{u.shotCount}</p>
											<p class="text-label-caps text-on-surface-variant/40">Shots</p>
										</div>
									</div>

									<!-- Delete -->
									<button
										onclick={() => requestDelete('user', u.id, u.name)}
										disabled={deletingId === u.id}
										class="flex-shrink-0 rounded-full p-2 text-on-surface-variant/30 transition-all hover:bg-error/5 hover:text-error active:scale-90 disabled:pointer-events-none"
										aria-label="Delete user {u.name}"
									>
										<span class="material-symbols-outlined text-[18px]">person_remove</span>
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Recent Activity (5 cols) -->
				<div class="lg:col-span-5" use:reveal={100}>
					<div class="rounded-xl border border-primary/5 bg-surface-container-low">
						<div class="flex items-center justify-between border-b border-outline-variant/10 px-6 py-5">
							<div>
								<h2 class="text-headline-md">Recent Activity</h2>
								<p class="text-label-caps mt-0.5 text-on-surface-variant/50">Latest shots — all users</p>
							</div>
							<span class="material-symbols-outlined text-crema-gold text-[22px]">history</span>
						</div>

						<div class="divide-y divide-outline-variant/10">
							{#each stats.activity as shot (shot.id)}
								<div class="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-surface-container {deletingId === shot.id ? 'opacity-40' : ''}">
									<img src={shot.img || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=60&h=60&auto=format&fit=crop&q=80'}
										alt={shot.bean}
										class="h-10 w-10 flex-shrink-0 rounded-lg object-cover grayscale" />

									<div class="min-w-0 flex-1">
										<p class="text-body-md truncate font-semibold">{shot.bean}</p>
										<div class="flex items-center gap-2">
											<p class="text-label-caps text-crema-gold/70">{shot.userName}</p>
											<span class="text-on-surface-variant/30">·</span>
											<p class="text-label-caps text-on-surface-variant/50">{shot.time}s</p>
										</div>
									</div>

									<!-- Stars -->
									<div class="flex flex-shrink-0 gap-0.5">
										{#each Array.from({ length: 5 }) as _, i}
											<span class="material-symbols-outlined text-[12px]"
												class:text-crema-gold={i < shot.rating}
												class:text-outline-variant={i >= shot.rating}
												style="font-variation-settings: 'FILL' {i < shot.rating ? 1 : 0}">star</span>
										{/each}
									</div>

									<!-- Delete shot -->
									<button
										onclick={() => requestDelete('shot', shot.id, shot.bean)}
										disabled={deletingId === shot.id}
										class="flex-shrink-0 rounded-full p-1.5 text-on-surface-variant/30 transition-all hover:bg-error/5 hover:text-error active:scale-90 disabled:pointer-events-none"
										aria-label="Delete shot"
									>
										<span class="material-symbols-outlined text-[16px]">delete</span>
									</button>
								</div>
							{/each}

							{#if stats.activity.length === 0}
								<div class="flex flex-col items-center py-12 text-center">
									<span class="material-symbols-outlined mb-3 text-[36px] text-crema-gold/20">coffee</span>
									<p class="text-body-md text-on-surface-variant/50">No shots logged yet</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- ── Per-user breakdown ── -->
			<div class="mt-6" use:reveal={200}>
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-7">
					<h2 class="text-headline-md mb-6">Data Breakdown by User</h2>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{#each stats.users as u}
							<div class="rounded-xl border border-outline-variant/10 p-5 transition-all hover:border-crema-gold/20 hover:shadow-sm">
								<div class="mb-3 flex items-center gap-3">
									<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white
										{u.role === 'admin' ? 'bg-crema-gold' : 'bg-on-surface-variant/30'}">
										{initial(u.name)}
									</div>
									<div class="min-w-0">
										<p class="text-label-sm truncate font-semibold">{u.name}</p>
										<p class="text-label-caps truncate text-on-surface-variant/40">{u.role}</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-2">
									<div class="rounded-lg bg-surface-container-high/60 py-2.5 text-center">
										<p class="font-display text-[22px] font-bold text-crema-gold">{u.beanCount}</p>
										<p class="text-label-caps text-on-surface-variant/40">Beans</p>
									</div>
									<div class="rounded-lg bg-surface-container-high/60 py-2.5 text-center">
										<p class="font-display text-[22px] font-bold text-crema-gold">{u.shotCount}</p>
										<p class="text-label-caps text-on-surface-variant/40">Shots</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

		{:else}
			<div class="flex flex-col items-center py-32 text-center">
				<span class="material-symbols-outlined mb-4 text-[48px] text-error/40">error</span>
				<p class="text-headline-md text-on-surface-variant">Failed to load admin data</p>
				<button onclick={fetchStats} class="text-label-caps mt-4 rounded-full bg-crema-gold px-6 py-3 text-white uppercase tracking-widest transition-all hover:brightness-110 active:scale-95">
					Retry
				</button>
			</div>
		{/if}
	</div>
</div>
