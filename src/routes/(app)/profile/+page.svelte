<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { profile, xp, level, levelLabel, levelInfo, allBadges, stats } = data;

	const MACHINE_LABELS: Record<string, string> = {
		espresso_semi: '☕ Espresso (Semi-Auto)',
		espresso_auto: '🤖 Espresso (Auto/Smart)',
		pour_over:     '🫖 Pour Over',
		aeropress:     '🟡 AeroPress',
		french_press:  '🫘 French Press',
		moka_pot:      '💧 Moka Pot',
		cold_brew:     '🧊 Cold Brew',
		other:         '🔧 Multiple / Other'
	};

	const SKILL_LABELS: Record<string, string> = {
		beginner:    '🌱 Beginner',
		home_barista:'☕ Home Barista',
		expert:      '🏆 Expert'
	};

	const progressPct = $derived(
		levelInfo.total > 0 ? Math.min(100, Math.round((levelInfo.current / levelInfo.total) * 100)) : 100
	);

	const earnedBadges = $derived(allBadges.filter((b: { earned: boolean }) => b.earned));
	const lockedBadges = $derived(allBadges.filter((b: { earned: boolean }) => !b.earned));
</script>

<svelte:head>
	<title>Profile | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Header -->
		<header class="mb-10" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Your Journey</p>
			<h1 class="text-headline-xl text-primary">Profile</h1>
		</header>

		<div class="grid grid-cols-1 gap-gutter lg:grid-cols-12">

			<!-- Left: identity + XP -->
			<div class="space-y-5 lg:col-span-4">

				<!-- Identity card -->
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-6" use:reveal={0}>
					<div class="mb-5 flex items-center gap-4">
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-crema-gold/15 ring-2 ring-crema-gold/30">
							<span class="font-display text-[28px] font-bold text-crema-gold">{profile.name[0].toUpperCase()}</span>
						</div>
						<div>
							<h2 class="text-headline-md leading-tight">{profile.name}</h2>
							<p class="text-label-caps text-on-surface-variant/50">{profile.email}</p>
						</div>
					</div>
					<div class="space-y-2 text-label-sm">
						<div class="flex items-center justify-between rounded-lg bg-surface-container px-3 py-2">
							<span class="text-on-surface-variant/60">Experience</span>
							<span class="font-semibold">{SKILL_LABELS[profile.skillLevel] ?? profile.skillLevel}</span>
						</div>
						<div class="flex items-center justify-between rounded-lg bg-surface-container px-3 py-2">
							<span class="text-on-surface-variant/60">Machine</span>
							<span class="font-semibold">{MACHINE_LABELS[profile.machineType] ?? profile.machineType}</span>
						</div>
						<div class="flex items-center justify-between rounded-lg bg-surface-container px-3 py-2">
							<span class="text-on-surface-variant/60">Member since</span>
							<span class="font-semibold">{profile.memberSince}</span>
						</div>
					</div>
					<a href="/settings" class="mt-4 flex items-center gap-1.5 text-label-sm text-crema-gold hover:underline">
						<span class="material-symbols-outlined text-[14px]">edit</span>
						Edit in Settings
					</a>
				</div>

				<!-- XP + Level card -->
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-6" use:reveal={100}>
					<div class="mb-4 flex items-center justify-between">
						<div>
							<p class="text-label-caps text-crema-gold">Current Level</p>
							<h3 class="text-headline-md mt-0.5">{levelLabel}</h3>
						</div>
						<div class="text-right">
							<p class="font-mono text-[28px] font-bold text-crema-gold">{xp}</p>
							<p class="text-label-caps text-on-surface-variant/50">total XP</p>
						</div>
					</div>

					{#if levelInfo.next !== 'max'}
						<div class="mb-2 flex justify-between">
							<span class="text-label-caps text-on-surface-variant/50">Progress to next level</span>
							<span class="text-label-caps text-crema-gold">{progressPct}%</span>
						</div>
						<div class="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
							<div class="h-full rounded-full bg-crema-gold transition-all duration-700"
								style="width: {progressPct}%"></div>
						</div>
						<p class="mt-2 text-label-caps text-on-surface-variant/40">{levelInfo.needed} XP to {levelInfo.next.replace(/_/g, ' ')}</p>
					{:else}
						<div class="rounded-lg bg-crema-gold/10 px-4 py-3 text-center">
							<p class="text-label-caps text-crema-gold">Maximum level reached 👑</p>
						</div>
					{/if}
				</div>

				<!-- Stats card -->
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-6" use:reveal={200}>
					<h3 class="text-headline-md mb-4">Stats</h3>
					<div class="grid grid-cols-2 gap-3">
						{#each [
							{ label: 'Total Shots', val: stats.totalShots, icon: 'coffee' },
							{ label: 'Avg Rating',  val: `${stats.avgRating} ★`, icon: 'star' },
							{ label: 'Beans',       val: stats.totalBeans, icon: 'local_library' },
							{ label: 'Fav Origin',  val: stats.favOrigin, icon: 'public' }
						] as stat}
							<div class="rounded-xl bg-surface-container px-4 py-3">
								<span class="material-symbols-outlined text-crema-gold text-[18px]">{stat.icon}</span>
								<p class="mt-1 font-mono text-[18px] font-bold text-primary">{stat.val}</p>
								<p class="text-label-caps text-on-surface-variant/50">{stat.label}</p>
							</div>
						{/each}
					</div>
					{#if stats.favBean !== '—'}
						<div class="mt-3 rounded-xl bg-crema-gold/5 border border-crema-gold/20 px-4 py-3">
							<p class="text-label-caps text-crema-gold">Favourite Bean</p>
							<p class="text-body-md font-semibold mt-0.5">{stats.favBean}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Right: badges -->
			<div class="lg:col-span-8" use:reveal={150}>
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-6 md:p-8">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<h2 class="text-headline-md">Badges</h2>
							<p class="text-label-sm mt-0.5 text-on-surface-variant">{earnedBadges.length} earned · {lockedBadges.length} locked</p>
						</div>
						<div class="flex h-11 w-11 items-center justify-center rounded-full bg-crema-gold/10">
							<span class="material-symbols-outlined text-crema-gold text-[22px]" style="font-variation-settings:'FILL' 1">military_tech</span>
						</div>
					</div>

					{#if earnedBadges.length > 0}
						<p class="text-label-caps mb-3 text-crema-gold">Earned</p>
						<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
							{#each earnedBadges as badge}
								<div class="group flex flex-col items-center gap-2 rounded-xl border border-crema-gold/20 bg-crema-gold/5 p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm">
									<span class="text-3xl">{badge.emoji}</span>
									<p class="text-label-sm font-semibold text-primary">{badge.label}</p>
									<p class="text-label-caps text-on-surface-variant/50 leading-tight">{badge.desc}</p>
								</div>
							{/each}
						</div>
					{/if}

					{#if lockedBadges.length > 0}
						<p class="text-label-caps mb-3 text-on-surface-variant/40">Locked</p>
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{#each lockedBadges as badge}
								<div class="flex flex-col items-center gap-2 rounded-xl border border-outline-variant/10 bg-surface-container p-4 text-center opacity-50">
									<span class="text-3xl grayscale">{badge.emoji}</span>
									<p class="text-label-sm font-semibold text-on-surface-variant">{badge.label}</p>
									<p class="text-label-caps text-on-surface-variant/50 leading-tight">{badge.desc}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
