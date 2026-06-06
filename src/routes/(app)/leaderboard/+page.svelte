<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { leaderboard, myRank, currentUserId } = data;

	const medalColor = (rank: number) =>
		rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-600' : 'text-on-surface-variant/30';

	const medalIcon = (rank: number) =>
		rank <= 3 ? 'emoji_events' : 'tag';
</script>

<svelte:head>
	<title>Leaderboard | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[860px]">

		<!-- Header -->
		<header class="mb-10 text-center" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Community</p>
			<h1 class="text-headline-xl text-primary">Leaderboard</h1>
			<p class="text-body-lg mt-2 text-on-surface-variant">Top brewers ranked by experience points</p>
		</header>

		<!-- Top 3 podium -->
		{#if leaderboard.length >= 3}
			<div class="mb-10 flex items-end justify-center gap-4" use:reveal={100}>
				<!-- 2nd -->
				<div class="flex flex-col items-center gap-2 pb-2">
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high ring-2 ring-slate-300/50">
						<span class="font-display text-[22px] font-bold text-slate-400">{leaderboard[1].name[0].toUpperCase()}</span>
					</div>
					<div class="text-center">
						<p class="text-label-sm font-semibold truncate max-w-[80px]">{leaderboard[1].name}</p>
						<p class="font-mono text-sm text-on-surface-variant/60">{leaderboard[1].xp} XP</p>
					</div>
					<div class="flex h-14 w-20 items-center justify-center rounded-t-xl bg-surface-container-high">
						<span class="material-symbols-outlined text-[28px] text-slate-400" style="font-variation-settings:'FILL' 1">emoji_events</span>
					</div>
				</div>

				<!-- 1st -->
				<div class="flex flex-col items-center gap-2">
					<div class="flex h-18 w-18 items-center justify-center rounded-full bg-crema-gold/20 ring-2 ring-crema-gold/50"
						style="width:72px;height:72px">
						<span class="font-display text-[28px] font-bold text-crema-gold">{leaderboard[0].name[0].toUpperCase()}</span>
					</div>
					<div class="text-center">
						<p class="text-label-sm font-semibold truncate max-w-[80px]">{leaderboard[0].name}</p>
						<p class="font-mono text-sm font-bold text-crema-gold">{leaderboard[0].xp} XP</p>
					</div>
					<div class="flex h-20 w-20 items-center justify-center rounded-t-xl bg-crema-gold/15 border border-crema-gold/30">
						<span class="material-symbols-outlined text-[32px] text-crema-gold" style="font-variation-settings:'FILL' 1">emoji_events</span>
					</div>
				</div>

				<!-- 3rd -->
				<div class="flex flex-col items-center gap-2 pb-2">
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high ring-2 ring-amber-600/30">
						<span class="font-display text-[22px] font-bold text-amber-600">{leaderboard[2].name[0].toUpperCase()}</span>
					</div>
					<div class="text-center">
						<p class="text-label-sm font-semibold truncate max-w-[80px]">{leaderboard[2].name}</p>
						<p class="font-mono text-sm text-on-surface-variant/60">{leaderboard[2].xp} XP</p>
					</div>
					<div class="flex h-10 w-20 items-center justify-center rounded-t-xl bg-surface-container-high">
						<span class="material-symbols-outlined text-[24px] text-amber-600" style="font-variation-settings:'FILL' 1">emoji_events</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Full table -->
		<div class="rounded-xl border border-primary/5 bg-surface-container-low overflow-hidden" use:reveal={200}>
			<!-- Table header -->
			<div class="grid grid-cols-[40px_1fr_auto_auto] gap-3 border-b border-outline-variant/10 bg-surface-container px-4 py-3 sm:grid-cols-[48px_1fr_auto_auto] sm:gap-4 sm:px-6">
				<p class="text-label-caps text-on-surface-variant/40">Rank</p>
				<p class="text-label-caps text-on-surface-variant/40">Brewer</p>
				<p class="text-label-caps text-on-surface-variant/40 text-right">Level</p>
				<p class="text-label-caps text-on-surface-variant/40 text-right">XP</p>
			</div>

			{#each leaderboard as entry}
				<div class="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3 border-b border-outline-variant/5 px-4 py-4 transition-colors last:border-0 sm:grid-cols-[48px_1fr_auto_auto] sm:gap-4 sm:px-6
					{entry.isCurrentUser ? 'bg-crema-gold/5 border-l-4 border-l-crema-gold' : 'hover:bg-surface-container-low/60'}">

					<!-- Rank -->
					<div class="flex items-center justify-center">
						{#if entry.rank <= 3}
							<span class="material-symbols-outlined text-[22px] {medalColor(entry.rank)}" style="font-variation-settings:'FILL' 1">emoji_events</span>
						{:else}
							<span class="font-mono text-sm text-on-surface-variant/40">#{entry.rank}</span>
						{/if}
					</div>

					<!-- Name + badges -->
					<div class="flex items-center gap-3 min-w-0">
						<div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full
							{entry.isCurrentUser ? 'bg-crema-gold/20 ring-1 ring-crema-gold/50' : 'bg-surface-container-high'}">
							<span class="font-semibold text-sm {entry.isCurrentUser ? 'text-crema-gold' : 'text-on-surface-variant'}">{entry.name[0].toUpperCase()}</span>
						</div>
						<div class="min-w-0">
							<p class="text-body-md font-semibold truncate {entry.isCurrentUser ? 'text-crema-gold' : ''}">
								{entry.name}
								{#if entry.isCurrentUser}<span class="text-label-caps ml-1 text-crema-gold/60">(you)</span>{/if}
							</p>
							{#if entry.badgeCount > 0}
								<p class="text-label-caps text-on-surface-variant/40">{entry.badgeCount} badge{entry.badgeCount !== 1 ? 's' : ''}</p>
							{/if}
						</div>
					</div>

					<!-- Level -->
					<p class="text-label-sm text-on-surface-variant whitespace-nowrap">{entry.levelLabel}</p>

					<!-- XP -->
					<p class="font-mono text-sm font-bold text-crema-gold text-right">{entry.xp}</p>
				</div>
			{/each}

			{#if leaderboard.length === 0}
				<div class="py-16 text-center">
					<span class="material-symbols-outlined mb-4 text-[48px] text-crema-gold/30">leaderboard</span>
					<p class="text-body-md text-on-surface-variant">No brewers yet — log shots to earn XP!</p>
				</div>
			{/if}
		</div>

		<!-- Current user outside top 25 -->
		{#if myRank}
			<div class="mt-4 flex items-center gap-4 rounded-xl border border-crema-gold/30 bg-crema-gold/5 px-6 py-4">
				<span class="material-symbols-outlined text-crema-gold text-[20px]">person</span>
				<p class="text-body-md text-on-surface">Your rank: <span class="font-bold text-crema-gold">#{myRank}</span> — keep logging shots to climb the board!</p>
			</div>
		{/if}

		<!-- Privacy note -->
		<p class="mt-6 text-center text-label-caps text-on-surface-variant/30">
			To hide your name, disable "Public on Leaderboard" in Settings → Profile
		</p>
	</div>
</div>
