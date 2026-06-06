<script lang="ts">
	import { goto } from '$app/navigation';

	// Steps: 0=credentials, 1=skill, 2=machine, 3=goals
	let step = $state(0);

	// Step 0
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);

	// Step 1
	let skillLevel = $state('');

	// Step 2
	let machineType = $state('');

	// Step 3
	let goals = $state<string[]>([]);

	let loading = $state(false);
	let error = $state('');

	const STEPS = ['Account', 'Experience', 'Machine', 'Goals'];

	const SKILLS = [
		{ id: 'beginner',    emoji: '🌱', label: 'Beginner',     desc: "I'm just getting started" },
		{ id: 'home_barista',emoji: '☕', label: 'Home Barista',  desc: 'I brew regularly at home' },
		{ id: 'expert',      emoji: '🏆', label: 'Expert',        desc: 'I know my parameters' }
	];

	const MACHINES = [
		{ id: 'espresso_semi',  emoji: '☕', label: 'Espresso (Semi-Auto)', desc: 'Siebträger manuell' },
		{ id: 'espresso_auto',  emoji: '🤖', label: 'Espresso (Auto/Smart)',desc: 'z.B. Sage Barista Touch' },
		{ id: 'pour_over',      emoji: '🫖', label: 'Pour Over',             desc: 'V60, Chemex, Kalita' },
		{ id: 'aeropress',      emoji: '🟡', label: 'AeroPress',             desc: '' },
		{ id: 'french_press',   emoji: '🫘', label: 'French Press',          desc: '' },
		{ id: 'moka_pot',       emoji: '💧', label: 'Moka Pot',              desc: '' },
		{ id: 'cold_brew',      emoji: '🧊', label: 'Cold Brew',             desc: '' },
		{ id: 'other',          emoji: '🔧', label: 'Multiple / Other',      desc: '' }
	];

	const GOALS = [
		{ id: 'perfect_shot',   emoji: '🎯', label: 'Find my perfect shot' },
		{ id: 'track_progress', emoji: '📈', label: 'Track my progress over time' },
		{ id: 'explore_beans',  emoji: '🫘', label: 'Explore different beans' },
		{ id: 'better_barista', emoji: '🏆', label: 'Become a better barista' },
		{ id: 'coffee_diary',   emoji: '📝', label: 'Keep a coffee diary' }
	];

	function toggleGoal(id: string) {
		goals = goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id];
	}

	function validate(): boolean {
		error = '';
		if (step === 0) {
			if (!name.trim())   { error = 'Please enter your name.'; return false; }
			if (!email.trim() || !email.includes('@')) { error = 'Please enter a valid email.'; return false; }
			if (password.length < 6) { error = 'Password must be at least 6 characters.'; return false; }
		}
		if (step === 1 && !skillLevel)  { error = 'Please select your experience level.'; return false; }
		if (step === 2 && !machineType) { error = 'Please select your machine type.'; return false; }
		return true;
	}

	function next() {
		if (!validate()) return;
		step++;
	}

	function back() {
		error = '';
		step--;
	}

	async function handleRegister() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password, skillLevel, machineType, goals })
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

	<!-- Grain -->
	<div class="pointer-events-none fixed inset-0 opacity-[0.025]"
		style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%221%22/></svg>');"></div>

	<a href="/" class="mb-8 text-[28px] font-display font-bold tracking-[0.12em] text-crema-gold uppercase transition-opacity hover:opacity-75">
		Beanery
	</a>

	<div class="w-full max-w-lg">
		<!-- Step indicator -->
		<div class="mb-8 flex items-center justify-center gap-2">
			{#each STEPS as label, i}
				<div class="flex items-center gap-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300
						{i < step ? 'bg-crema-gold text-white' : i === step ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant/40'}">
						{#if i < step}
							<span class="material-symbols-outlined text-[14px]">check</span>
						{:else}
							{i + 1}
						{/if}
					</div>
					<span class="hidden text-label-caps sm:block {i === step ? 'text-primary' : 'text-on-surface-variant/40'}">{label}</span>
				</div>
				{#if i < STEPS.length - 1}
					<div class="h-px w-6 flex-shrink-0 transition-colors duration-300 {i < step ? 'bg-crema-gold' : 'bg-outline-variant/30'}"></div>
				{/if}
			{/each}
		</div>

		<!-- Card -->
		<div class="rounded-2xl border border-primary/5 bg-surface-container-low p-8 shadow-xl" style="animation: slideUp 0.3s ease-out">

			{#if step === 0}
				<!-- ── Step 0: Account ── -->
				<div class="mb-7 text-center">
					<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-crema-gold/10 ring-1 ring-crema-gold/20">
						<span class="material-symbols-outlined text-crema-gold text-[28px]" style="font-variation-settings: 'FILL' 1">person_add</span>
					</div>
					<h1 class="font-display text-[26px] font-bold text-primary">Create your account</h1>
					<p class="text-body-md mt-1 text-on-surface-variant">Your personal coffee laboratory</p>
				</div>

				<div class="space-y-4">
					<div>
						<label for="name" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Full Name</label>
						<input id="name" type="text" bind:value={name} required autocomplete="name" placeholder="Your name"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40" />
					</div>
					<div>
						<label for="email" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Email Address</label>
						<input id="email" type="email" bind:value={email} required autocomplete="email" placeholder="you@example.com"
							class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40" />
					</div>
					<div>
						<label for="password" class="text-label-sm mb-2 block text-on-surface-variant uppercase">Password</label>
						<div class="relative">
							<input id="password" type={showPassword ? 'text' : 'password'} bind:value={password} required autocomplete="new-password" placeholder="At least 6 characters"
								class="text-body-md w-full rounded-lg border border-outline-variant/30 bg-surface-bright p-4 pr-12 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60 hover:border-crema-gold/40" />
							<button type="button" onclick={() => (showPassword = !showPassword)} class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors hover:text-crema-gold">
								<span class="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
							</button>
						</div>
						<div class="mt-2 flex gap-1">
							{#each [6, 8, 12] as t, i}
								<div class="h-1 flex-1 rounded-full transition-colors duration-300 {password.length >= t ? (i === 0 ? 'bg-error' : i === 1 ? 'bg-crema-gold' : 'bg-green-500') : 'bg-outline-variant/30'}"></div>
							{/each}
						</div>
					</div>
				</div>

			{:else if step === 1}
				<!-- ── Step 1: Skill ── -->
				<div class="mb-7 text-center">
					<p class="text-label-caps mb-1 text-crema-gold">Step 2 of 4</p>
					<h2 class="font-display text-[24px] font-bold text-primary">What's your experience level?</h2>
					<p class="text-body-md mt-1 text-on-surface-variant">This personalises your Shot Logger</p>
				</div>
				<div class="space-y-3">
					{#each SKILLS as s}
						<button type="button" onclick={() => (skillLevel = s.id)}
							class="flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.99]
								{skillLevel === s.id ? 'border-crema-gold bg-crema-gold/5 shadow-sm' : 'border-outline-variant/20 bg-surface-bright hover:border-crema-gold/40'}">
							<span class="text-3xl">{s.emoji}</span>
							<div>
								<p class="text-body-md font-semibold">{s.label}</p>
								<p class="text-label-sm text-on-surface-variant">{s.desc}</p>
							</div>
							{#if skillLevel === s.id}
								<span class="ml-auto material-symbols-outlined text-crema-gold text-[22px]" style="font-variation-settings:'FILL' 1">check_circle</span>
							{/if}
						</button>
					{/each}
				</div>

			{:else if step === 2}
				<!-- ── Step 2: Machine ── -->
				<div class="mb-7 text-center">
					<p class="text-label-caps mb-1 text-crema-gold">Step 3 of 4</p>
					<h2 class="font-display text-[24px] font-bold text-primary">What machine do you use?</h2>
					<p class="text-body-md mt-1 text-on-surface-variant">Adapts your logging fields</p>
				</div>
				<div class="grid grid-cols-2 gap-2.5">
					{#each MACHINES as m}
						<button type="button" onclick={() => (machineType = m.id)}
							class="flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 active:scale-[0.98]
								{machineType === m.id ? 'border-crema-gold bg-crema-gold/5 shadow-sm' : 'border-outline-variant/20 bg-surface-bright hover:border-crema-gold/40'}">
							<span class="text-2xl">{m.emoji}</span>
							<p class="text-label-sm font-semibold leading-tight">{m.label}</p>
							{#if m.desc}
								<p class="text-[10px] text-on-surface-variant/50 leading-tight">{m.desc}</p>
							{/if}
						</button>
					{/each}
				</div>

			{:else if step === 3}
				<!-- ── Step 3: Goals ── -->
				<div class="mb-7 text-center">
					<p class="text-label-caps mb-1 text-crema-gold">Step 4 of 4</p>
					<h2 class="font-display text-[24px] font-bold text-primary">What are your goals?</h2>
					<p class="text-body-md mt-1 text-on-surface-variant">Select all that apply</p>
				</div>
				<div class="space-y-2.5">
					{#each GOALS as g}
						<button type="button" onclick={() => toggleGoal(g.id)}
							class="flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.99]
								{goals.includes(g.id) ? 'border-crema-gold bg-crema-gold/5' : 'border-outline-variant/20 bg-surface-bright hover:border-crema-gold/40'}">
							<span class="text-2xl">{g.emoji}</span>
							<p class="text-body-md font-medium flex-1">{g.label}</p>
							<div class="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded border-2 transition-colors {goals.includes(g.id) ? 'border-crema-gold bg-crema-gold' : 'border-outline-variant/40'}">
								{#if goals.includes(g.id)}
									<span class="material-symbols-outlined text-white select-none leading-none" style="font-size:13px;font-variation-settings:'FILL' 1">check</span>
								{/if}
							</div>
						</button>
					{/each}
				</div>
				<p class="text-label-caps mt-3 text-center text-on-surface-variant/40">You can skip this — optional</p>
			{/if}

			<!-- Error -->
			{#if error}
				<div class="mt-4 flex items-center gap-2.5 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
					<span class="material-symbols-outlined flex-shrink-0 text-error text-[18px]">error</span>
					<p class="text-label-sm text-error">{error}</p>
				</div>
			{/if}

			<!-- Navigation buttons -->
			<div class="mt-6 flex gap-3">
				{#if step > 0}
					<button type="button" onclick={back}
						class="flex items-center gap-2 rounded-full border border-outline-variant/30 px-6 py-3.5 text-on-surface-variant transition-all hover:border-crema-gold/40 hover:text-on-surface active:scale-95">
						<span class="material-symbols-outlined text-[18px]">arrow_back</span>
						<span class="text-label-sm uppercase tracking-widest">Back</span>
					</button>
				{/if}

				{#if step < 3}
					<button type="button" onclick={next}
						class="text-label-caps flex flex-1 items-center justify-center gap-2 rounded-full bg-crema-gold py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:brightness-110 hover:shadow-lg active:scale-95">
						Continue
						<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
					</button>
				{:else}
					<button type="button" onclick={handleRegister} disabled={loading}
						class="text-label-caps flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-white uppercase tracking-widest shadow-sm transition-all hover:bg-crema-gold hover:shadow-lg active:scale-95 disabled:opacity-60">
						{#if loading}
							<span class="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
							Creating account…
						{:else}
							<span class="material-symbols-outlined text-[20px]">person_add</span>
							Create Account
						{/if}
					</button>
				{/if}
			</div>
		</div>

		<p class="text-body-md mt-5 text-center text-on-surface-variant">
			Already have an account?
			<a href="/login" class="text-crema-gold underline decoration-crema-gold/40 underline-offset-4 transition-colors hover:decoration-crema-gold">Sign in</a>
		</p>
	</div>

	<p class="text-label-caps mt-8 text-on-surface-variant/30">Beanery Coffee Labs · 2026</p>
</div>

<style>
	:global(body) { background-color: #FBF9F4; }
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(12px); }
		to   { opacity: 1; transform: translateY(0); }
	}
</style>
