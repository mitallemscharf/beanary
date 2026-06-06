<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Beanery | The Art of Extraction</title>
</svelte:head>

<!-- ──────────── Header ──────────── -->
<header class="sticky top-0 z-50 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-md">
	<div class="mx-auto flex h-20 w-full max-w-[1140px] items-center justify-between px-4 md:px-margin-desktop">
		<div class="flex items-center gap-10">
			<a
				href="/"
				class="text-headline-md font-display tracking-[0.12em] text-crema-gold uppercase transition-all duration-300 hover:scale-105 active:scale-95"
			>
				Beanery
			</a>
			<nav class="hidden items-center gap-7 md:flex">
				<a href="/login" class="text-label-sm text-on-surface-variant transition-colors hover:text-crema-gold">Guides</a>
				<a href="/login" class="text-label-sm text-on-surface-variant transition-colors hover:text-crema-gold">Glossar</a>
			</nav>
		</div>
		<div class="flex items-center gap-3">
			{#if data.user}
				<a
					href="/dashboard"
					class="text-label-caps inline-block rounded-full bg-primary px-6 py-2.5 text-white uppercase tracking-widest shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:bg-crema-gold hover:shadow-lg active:scale-95"
				>
					Go to App
				</a>
			{:else}
				<a href="/login" class="text-label-sm text-on-surface-variant transition-colors hover:text-crema-gold hidden md:block">
					Log In
				</a>
				<a
					href="/register"
					class="text-label-caps inline-block rounded-full bg-primary px-6 py-2.5 text-white uppercase tracking-widest shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:bg-crema-gold hover:shadow-lg active:scale-95"
				>
					Get Started
				</a>
			{/if}
		</div>
	</div>
</header>

<main class="mx-auto max-w-[1140px] px-container-padding">

	<!-- ──────────── Hero ──────────── -->
	<section class="flex min-h-[75vh] flex-col items-center gap-12 py-16 md:flex-row md:gap-16">
		<div class="flex-1 space-y-7" use:reveal={0}>
			<p class="text-label-caps text-crema-gold">The Morning Ritual</p>
			<h1 class="text-headline-xl text-primary">
				The Art of<br />
				<em class="font-normal italic">Extraction</em>
			</h1>
			<p class="text-body-lg max-w-md text-on-surface-variant">
				Elevate your daily brew through the precision of coffee science. Track every gram, second,
				and degree to find your perfect cup.
			</p>
			<div class="flex flex-col gap-3 pt-2 sm:flex-row">
				{#if data.user}
					<a
						href="/dashboard"
						class="text-label-caps inline-block rounded-full bg-primary px-10 py-4 text-white uppercase tracking-widest shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-crema-gold hover:shadow-lg active:scale-95"
					>
						Go to App
					</a>
				{:else}
					<a
						href="/login"
						class="text-label-caps inline-block rounded-full bg-primary px-10 py-4 text-white uppercase tracking-widest shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-crema-gold hover:shadow-lg active:scale-95"
					>
						Enter the Laboratory
					</a>
					<a
						href="/register"
						class="text-label-caps inline-block rounded-full border border-primary/20 px-10 py-4 text-primary uppercase tracking-widest transition-all duration-500 hover:-translate-y-1 hover:border-crema-gold hover:text-crema-gold hover:shadow-lg active:scale-95"
					>
						Get Started Free
					</a>
				{/if}
			</div>
		</div>

		<div class="relative w-full flex-1 max-w-[480px]" use:reveal={180}>
			<div class="group aspect-square w-full overflow-hidden rounded-full border border-crema-gold/15 transition-shadow duration-700 hover:shadow-2xl">
				<img
					src="https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=700&h=700&auto=compress&cs=tinysrgb&fit=crop"
					alt="Espresso extraction"
					class="h-full w-full scale-105 object-cover transition-all duration-[1200ms] hover:scale-100"
				/>
			</div>
			<div class="absolute -bottom-2 left-2 sm:-bottom-5 sm:-left-5 border border-outline-variant/20 bg-surface-container-lowest/90 p-4 sm:p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
				<p class="text-headline-md text-crema-gold">98.2%</p>
				<p class="text-label-caps text-on-surface-variant/60">Consistency Score</p>
			</div>
		</div>
	</section>

	<!-- ──────────── Bento Grid ──────────── -->
	<section class="py-section-gap">
		<div class="mb-10" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Precision Tools</p>
			<h2 class="text-headline-lg text-primary">Your Coffee Arsenal</h2>
		</div>

		<div class="grid grid-cols-1 gap-gutter md:grid-cols-12">
			<!-- Shot Logger — 8 cols -->
			<a
				href="/login"
				class="group relative overflow-hidden rounded-xl border border-primary/5 bg-surface-container-low transition-all duration-500 hover:-translate-y-1 hover:border-crema-gold/40 hover:shadow-xl md:col-span-8"
				use:reveal={0}
			>
				<div class="absolute inset-0 z-0 opacity-10 transition-opacity duration-700 group-hover:opacity-25">
					<img
						src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&h=500&auto=format&fit=crop&q=80"
						alt=""
						aria-hidden="true"
						class="h-full w-full scale-100 object-cover transition-transform duration-[1200ms] group-hover:scale-105"
					/>
				</div>
				<div class="relative z-10 flex h-full min-h-[400px] flex-col justify-between p-10">
					<div class="flex items-start justify-between">
						<div class="rounded-lg bg-crema-gold/10 p-3 transition-colors duration-200 group-hover:bg-crema-gold/20">
							<span class="material-symbols-outlined text-crema-gold">timer</span>
						</div>
						<span class="text-label-caps text-crema-gold">Technical Focus</span>
					</div>
					<div>
						<h3 class="text-headline-lg mb-3 transition-colors duration-200 group-hover:text-crema-gold">Shot Logger</h3>
						<p class="text-body-md mb-6 max-w-sm text-on-surface-variant">
							Record every variable from grind size to yield. Our algorithm identifies the subtle shifts in your extraction profile.
						</p>
						<span class="text-label-sm inline-flex items-center gap-2 text-crema-gold uppercase tracking-widest transition-all duration-200 group-hover:gap-3">
							Log a Shot <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
						</span>
					</div>
				</div>
			</a>

			<!-- Bean Library — 4 cols -->
			<a
				href="/login"
				class="group flex flex-col justify-between overflow-hidden rounded-xl border border-primary/5 bg-surface-container-high/40 transition-all duration-300 hover:-translate-y-1 hover:border-crema-gold/30 hover:shadow-lg md:col-span-4"
				use:reveal={150}
			>
				<div class="p-8">
					<div class="mb-6 w-fit rounded-lg bg-primary/5 p-3 transition-colors duration-200 group-hover:bg-crema-gold/10">
						<span class="material-symbols-outlined text-on-surface-variant transition-colors group-hover:text-crema-gold">menu_book</span>
					</div>
					<h3 class="text-headline-md mb-2 transition-colors duration-200 group-hover:text-crema-gold">Bean Library</h3>
					<p class="text-body-md text-on-surface-variant">Curate your collection of roasts and origins. Sync with global sensory databases.</p>
				</div>
				<div class="overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=180&auto=format&fit=crop&q=80"
						alt="Coffee bean collection"
						class="h-40 w-full object-cover transition-all duration-500 group-hover:scale-105"
					/>
				</div>
			</a>

			<!-- Sweet Spot Finder — 4 cols -->
			<a
				href="/login"
				class="group flex flex-col justify-between rounded-xl border border-primary/5 bg-surface-container-high/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-crema-gold/30 hover:shadow-lg md:col-span-4"
				use:reveal={300}
			>
				<div class="flex flex-col gap-4">
					<div class="w-fit rounded-lg bg-primary/5 p-3 transition-colors duration-200 group-hover:bg-crema-gold/10">
						<span class="material-symbols-outlined text-on-surface-variant transition-colors group-hover:text-crema-gold">biotech</span>
					</div>
					<h3 class="text-headline-md transition-colors duration-200 group-hover:text-crema-gold">Sweet Spot Finder</h3>
					<p class="text-body-md text-on-surface-variant">Data-driven insights to help you dial in faster. Predictive models for your next brew.</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-6">
					<div class="flex -space-x-2 transition-all duration-300 group-hover:space-x-0.5">
						<div class="h-8 w-8 rounded-full border-2 border-surface-bright bg-crema-gold/25"></div>
						<div class="h-8 w-8 rounded-full border-2 border-surface-bright bg-tertiary-container/60"></div>
						<div class="h-8 w-8 rounded-full border-2 border-surface-bright bg-bean-body/70"></div>
					</div>
					<span class="text-label-sm text-on-surface-variant transition-colors group-hover:text-crema-gold">+12k Analysts</span>
				</div>
			</a>

			<!-- Extraction Intelligence — 8 cols -->
			<a
				href="/login"
				class="group flex flex-col items-center gap-8 rounded-xl border border-primary/5 bg-surface-bright p-10 transition-all duration-300 hover:-translate-y-1 hover:border-crema-gold/30 hover:shadow-lg md:col-span-8 md:flex-row"
				use:reveal={450}
			>
				<div class="flex-1">
					<h3 class="text-headline-md mb-3 transition-colors duration-200 group-hover:text-crema-gold">Extraction Intelligence</h3>
					<p class="text-body-md text-on-surface-variant">
						Our unique sensory wheel visualization allows you to map flavor profiles with scientific accuracy, identifying floral, nutty, and acidic notes in real-time.
					</p>
				</div>
				<div class="relative h-48 w-48 flex-shrink-0">
					<div class="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-crema-gold/30 transition-colors group-hover:border-crema-gold/60"></div>
					<div class="absolute inset-4 rounded-full border border-crema-gold/20 transition-colors group-hover:border-crema-gold/40"></div>
					<div class="absolute inset-10 rounded-full border border-crema-gold/10 transition-colors group-hover:border-crema-gold/25"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="material-symbols-outlined text-crema-gold text-[40px] transition-all duration-500 group-hover:scale-125">analytics</span>
					</div>
					<div class="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crema-gold transition-shadow duration-300 group-hover:shadow-[0_0_14px_rgba(197,160,89,0.95)]"></div>
					<div class="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-crema-gold/55"></div>
				</div>
			</a>
		</div>
	</section>

</main>

<!-- ──────────── Footer ──────────── -->
<footer class="border-t border-outline-variant/10 bg-surface-container-lowest py-12">
	<div class="mx-auto flex max-w-[1140px] flex-col items-center gap-8 px-margin-desktop md:flex-row md:justify-between">
		<div>
			<span class="text-label-sm block text-on-surface/80 uppercase tracking-widest">Beanery</span>
			<p class="text-label-caps mt-1 text-on-surface-variant/50">© 2026 Beanery Coffee Labs</p>
		</div>
		<nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start md:gap-x-8">
			{#each [
				{ href: '/login', label: 'Dashboard' },
				{ href: '/login', label: 'Shot Logger' },
				{ href: '/login', label: 'Library' },
				{ href: '/login', label: 'History' }
			] as link}
				<a href={link.href} class="text-label-caps text-on-surface-variant/60 transition-all duration-200 hover:text-crema-gold">{link.label}</a>
			{/each}
		</nav>
	</div>
</footer>
