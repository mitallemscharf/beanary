<script lang="ts">
	let email = $state('');
	let loading = $state(false);
	let error = $state('');
	let resetLink = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (loading) return;
		error = '';
		resetLink = '';
		loading = true;

		try {
			const res = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			const data = await res.json().catch(() => ({}));

			if (data.resetToken) {
				resetLink = `${window.location.origin}/reset-password/${data.resetToken}`;
			} else {
				// Email not found — still show the neutral success state
				resetLink = 'not_found';
			}
		} catch {
			error = 'Connection error — please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password | Beanery</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">

	<div class="pointer-events-none fixed inset-0 opacity-[0.025]"
		style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%221%22/></svg>');"></div>

	<a href="/" class="mb-10 text-[28px] font-display font-bold tracking-[0.12em] text-crema-gold uppercase transition-opacity hover:opacity-75">
		Beanery
	</a>

	<div class="w-full max-w-md rounded-2xl border border-primary/5 bg-surface-container-low p-10 shadow-xl">

		{#if !resetLink}
			<!-- Form state -->
			<div class="mb-8 text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
					<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 0, 'wght' 300">lock_reset</span>
				</div>
				<h1 class="font-display text-[28px] font-bold leading-tight text-primary">Forgot password?</h1>
				<p class="text-body-md mt-1.5 text-on-surface-variant">Enter your email and we'll send a reset link</p>
			</div>

			<form class="space-y-5" onsubmit={handleSubmit}>
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
						Sending…
					{:else}
						<span class="material-symbols-outlined text-[20px]">send</span>
						Send Reset Link
					{/if}
				</button>
			</form>

		{:else}
			<!-- Success state -->
			<div class="text-center">
				<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
					<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 1, 'wght' 300">mark_email_read</span>
				</div>
				<h1 class="font-display text-[28px] font-bold leading-tight text-primary mb-2">Check your inbox</h1>
				<p class="text-body-md text-on-surface-variant mb-6">
					If that email has an account, a reset link has been sent.
				</p>

				{#if resetLink !== 'not_found'}
					<!-- Demo environment helper -->
					<div class="rounded-xl border border-crema-gold/20 bg-crema-gold/5 p-5 text-left mb-6">
						<p class="text-label-caps mb-2 text-crema-gold">Demo environment</p>
						<p class="text-label-sm mb-3 text-on-surface-variant">No email service is configured. Use this link directly:</p>
						<a
							href={resetLink}
							class="block break-all font-mono text-[11px] text-crema-gold underline decoration-crema-gold/40 underline-offset-2 transition-colors hover:decoration-crema-gold"
						>
							{resetLink}
						</a>
					</div>
				{/if}
			</div>
		{/if}

		<p class="text-body-md mt-6 text-center text-on-surface-variant">
			Remembered it?
			<a href="/login" class="text-crema-gold underline decoration-crema-gold/40 underline-offset-4 transition-colors hover:decoration-crema-gold">Back to sign in</a>
		</p>
	</div>

	<p class="text-label-caps mt-8 text-on-surface-variant/30">Beanery Coffee Labs · 2026</p>
</div>

<style>
	:global(body) {
		background-color: #FBF9F4;
	}
</style>
