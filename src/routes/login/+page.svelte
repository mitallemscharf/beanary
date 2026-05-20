<script lang="ts">
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let showPassword = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (loading) return;
		error = '';
		loading = true;

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				error = data.message ?? 'Invalid email or password.';
				return;
			}

			goto('/dashboard');
		} catch {
			error = 'Connection error — please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In | Beanery</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">

	<!-- Grain texture -->
	<div class="pointer-events-none fixed inset-0 opacity-[0.025]"
		style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%221%22/></svg>');"></div>

	<!-- Logo -->
	<a href="/" class="mb-10 text-[28px] font-display font-bold tracking-[0.12em] text-crema-gold uppercase transition-opacity hover:opacity-75">
		Beanery
	</a>

	<!-- Card -->
	<div class="w-full max-w-md rounded-2xl border border-primary/5 bg-surface-container-low p-10 shadow-xl">

		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
				<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 1, 'wght' 300">coffee_maker</span>
			</div>
			<h1 class="font-display text-[28px] font-bold leading-tight text-primary">Welcome back</h1>
			<p class="text-body-md mt-1.5 text-on-surface-variant">Sign in to your laboratory</p>
		</div>

		<form class="space-y-5" onsubmit={handleLogin}>

			<!-- Email -->
			<div>
				<label for="email" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Email Address</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					autocomplete="email"
					placeholder="lenny@beanery.app"
					class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40"
				/>
			</div>

			<!-- Password -->
			<div>
				<label for="password" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Password</label>
				<div class="relative">
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						required
						autocomplete="current-password"
						placeholder="••••••••"
						class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 pr-12 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40"
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors hover:text-crema-gold"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						<span class="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
					</button>
				</div>
			</div>

			<!-- Error -->
			{#if error}
				<div class="flex items-center gap-2.5 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
					<span class="material-symbols-outlined flex-shrink-0 text-error text-[18px]">error</span>
					<p class="text-label-sm text-error">{error}</p>
				</div>
			{/if}

			<!-- Submit -->
			<button
				type="submit"
				disabled={loading}
				class="text-label-caps mt-2 flex w-full items-center justify-center gap-2.5 rounded-full bg-crema-gold py-4 text-white uppercase tracking-widest shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{#if loading}
					<span class="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
					Signing in…
				{:else}
					<span class="material-symbols-outlined text-[20px]">login</span>
					Sign In
				{/if}
			</button>
		</form>

		<!-- Demo credentials -->
		<div class="mt-6 rounded-xl border border-outline-variant/20 bg-surface-container-highest/60 p-4">
			<p class="text-label-caps mb-2.5 text-on-surface-variant/50">Demo Accounts</p>
			<div class="space-y-1.5">
				<button
					type="button"
					onclick={() => { email = 'lenny@beanery.app'; password = 'Beanery2026'; }}
					class="text-label-sm flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-container-high"
				>
					<span class="text-on-surface-variant">lenny@beanery.app</span>
					<span class="rounded bg-crema-gold/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-crema-gold">Admin</span>
				</button>
				<button
					type="button"
					onclick={() => { email = 'test@beanery.app'; password = 'Test2026'; }}
					class="text-label-sm flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-container-high"
				>
					<span class="text-on-surface-variant">test@beanery.app</span>
					<span class="rounded bg-surface-container-highest px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/60">User</span>
				</button>
			</div>
		</div>

		<!-- Register link -->
		<p class="text-body-md mt-6 text-center text-on-surface-variant">
			No account yet?
			<a href="/register" class="text-crema-gold underline decoration-crema-gold/40 underline-offset-4 transition-colors hover:decoration-crema-gold">Create one</a>
		</p>
	</div>

	<p class="text-label-caps mt-8 text-on-surface-variant/30">Beanery Coffee Labs · 2026</p>
</div>

<style>
	:global(body) {
		background-color: #FBF9F4;
	}
</style>
