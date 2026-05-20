<script lang="ts">
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let showPassword = $state(false);

	async function handleRegister(e: Event) {
		e.preventDefault();
		if (loading) return;
		error = '';

		if (password.length < 6) {
			error = 'Password must be at least 6 characters.';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				error = data.message ?? 'Registration failed. Please try again.';
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
	<title>Create Account | Beanery</title>
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
				<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 1, 'wght' 300">person_add</span>
			</div>
			<h1 class="font-display text-[28px] font-bold leading-tight text-primary">Create your account</h1>
			<p class="text-body-md mt-1.5 text-on-surface-variant">Start tracking your extractions</p>
		</div>

		<form class="space-y-5" onsubmit={handleRegister}>

			<!-- Name -->
			<div>
				<label for="name" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Full Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					autocomplete="name"
					placeholder="Your name"
					class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40"
				/>
			</div>

			<!-- Email -->
			<div>
				<label for="email" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Email Address</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					autocomplete="email"
					placeholder="you@example.com"
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
						autocomplete="new-password"
						placeholder="At least 6 characters"
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

				<!-- Password strength indicator -->
				<div class="mt-2 flex gap-1">
					{#each [6, 8, 12] as threshold, i}
						<div class="h-1 flex-1 rounded-full transition-colors duration-300 {password.length >= threshold ? (i === 0 ? 'bg-error' : i === 1 ? 'bg-crema-gold' : 'bg-green-500') : 'bg-outline-variant/30'}"></div>
					{/each}
				</div>
				<p class="text-label-caps mt-1 text-on-surface-variant/40">
					{password.length < 6 ? 'Too short' : password.length < 8 ? 'Weak' : password.length < 12 ? 'Good' : 'Strong'}
				</p>
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
					Creating account…
				{:else}
					<span class="material-symbols-outlined text-[20px]">person_add</span>
					Create Account
				{/if}
			</button>
		</form>

		<!-- Login link -->
		<p class="text-body-md mt-6 text-center text-on-surface-variant">
			Already have an account?
			<a href="/login" class="text-crema-gold underline decoration-crema-gold/40 underline-offset-4 transition-colors hover:decoration-crema-gold">Sign in</a>
		</p>
	</div>

	<p class="text-label-caps mt-8 text-on-surface-variant/30">Beanery Coffee Labs · 2026</p>
</div>

<style>
	:global(body) {
		background-color: #FBF9F4;
	}
</style>
