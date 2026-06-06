<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let newPassword = $state('');
	let confirmPassword = $state('');
	let showNew = $state(false);
	let showConfirm = $state(false);
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleReset(e: Event) {
		e.preventDefault();
		if (loading) return;
		error = '';

		if (newPassword !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}
		if (newPassword.length < 6) {
			error = 'Password must be at least 6 characters.';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: data.token, newPassword })
			});

			const d = await res.json().catch(() => ({}));

			if (res.ok) {
				success = true;
				setTimeout(() => goto('/login'), 2500);
			} else {
				error = d.message ?? 'Reset failed — the link may have expired.';
			}
		} catch {
			error = 'Connection error — please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password | Beanery</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">

	<div class="pointer-events-none fixed inset-0 opacity-[0.025]"
		style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%221%22/></svg>');"></div>

	<a href="/" class="mb-10 text-[28px] font-display font-bold tracking-[0.12em] text-crema-gold uppercase transition-opacity hover:opacity-75">
		Beanery
	</a>

	<div class="w-full max-w-md rounded-2xl border border-primary/5 bg-surface-container-low p-10 shadow-xl">

		{#if success}
			<!-- Success state -->
			<div class="text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
					<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 1, 'wght' 300">check_circle</span>
				</div>
				<h1 class="font-display text-[28px] font-bold leading-tight text-primary mb-2">Password updated</h1>
				<p class="text-body-md text-on-surface-variant">Redirecting you to sign in…</p>
			</div>

		{:else}
			<!-- Form state -->
			<div class="mb-8 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
					<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 0, 'wght' 300">key</span>
				</div>
				<h1 class="font-display text-[28px] font-bold leading-tight text-primary">Set new password</h1>
				<p class="text-body-md mt-1.5 text-on-surface-variant">Choose a strong password for your account</p>
			</div>

			<form class="space-y-5" onsubmit={handleReset}>

				<!-- New password -->
				<div>
					<label for="new-pass" class="text-label-sm mb-2 block text-on-surface-variant uppercase">New Password</label>
					<div class="relative">
						<input
							id="new-pass"
							type={showNew ? 'text' : 'password'}
							bind:value={newPassword}
							required
							autocomplete="new-password"
							placeholder="••••••••"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 pr-12 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40"
						/>
						<button type="button" onclick={() => (showNew = !showNew)}
							class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors hover:text-crema-gold">
							<span class="material-symbols-outlined text-[20px]">{showNew ? 'visibility_off' : 'visibility'}</span>
						</button>
					</div>
				</div>

				<!-- Confirm password -->
				<div>
					<label for="conf-pass" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Confirm New Password</label>
					<div class="relative">
						<input
							id="conf-pass"
							type={showConfirm ? 'text' : 'password'}
							bind:value={confirmPassword}
							required
							autocomplete="new-password"
							placeholder="••••••••"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 pr-12 outline-none transition-colors duration-200 focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40"
						/>
						<button type="button" onclick={() => (showConfirm = !showConfirm)}
							class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors hover:text-crema-gold">
							<span class="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
						</button>
					</div>
				</div>

				{#if error}
					<div class="flex items-center gap-2.5 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
						<span class="material-symbols-outlined flex-shrink-0 text-error text-[18px]">error</span>
						<p class="text-label-sm text-error">{error}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="text-label-caps mt-2 flex w-full items-center justify-center gap-2.5 rounded-full bg-crema-gold py-4 text-white uppercase tracking-widest shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{#if loading}
						<span class="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
						Updating…
					{:else}
						<span class="material-symbols-outlined text-[20px]">lock_reset</span>
						Reset Password
					{/if}
				</button>
			</form>
		{/if}

		{#if !success}
			<p class="text-body-md mt-6 text-center text-on-surface-variant">
				<a href="/login" class="text-crema-gold underline decoration-crema-gold/40 underline-offset-4 transition-colors hover:decoration-crema-gold">Back to sign in</a>
			</p>
		{/if}
	</div>

	<p class="text-label-caps mt-8 text-on-surface-variant/30">Beanery Coffee Labs · 2026</p>
</div>

<style>
	:global(body) {
		background-color: #FBF9F4;
	}
</style>
