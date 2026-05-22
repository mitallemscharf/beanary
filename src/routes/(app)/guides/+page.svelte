<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	const GUIDES = [
		{
			id: 'espresso',
			title: 'Espresso',
			emoji: '☕',
			difficulty: 'Intermediate',
			time: '2–3 min',
			machineTypes: ['espresso_semi', 'espresso_auto'],
			equipment: ['Espresso machine', 'Portafilter + basket', 'Precision scale', 'Grinder', 'Tamper'],
			steps: [
				{ step: 1, title: 'Grind fresh',        time: 0,  desc: 'Grind 18g of coffee at a fine-medium setting — it should feel like table salt.' },
				{ step: 2, title: 'Dose the basket',    time: 0,  desc: 'Add ground coffee to a dry, clean portafilter basket. Level with your finger.' },
				{ step: 3, title: 'Tamp evenly',        time: 10, desc: 'Apply ~15kg of even pressure straight down. The surface should be flat and smooth.' },
				{ step: 4, title: 'Lock and go',        time: 0,  desc: 'Lock the portafilter, place a pre-tared cup on the scale, and start your shot immediately.' },
				{ step: 5, title: 'Extract 25–35s',     time: 30, desc: 'Stop when yield reaches ~36g. The stream should be golden honey-coloured, not pale or dark.' },
				{ step: 6, title: 'Log and taste',      time: 0,  desc: 'Record your dose, yield, and time in Beanery. Taste, rate, and adjust for next time.' }
			],
			beginnerTip: 'Start with 18g in, 36g out, 30 seconds. If it flows too fast (under 20s), grind finer. Too slow (over 40s), grind coarser.',
			expertTip: 'Try pre-infusion: low pressure for 5–8s before full pressure. Reduces channelling on light, porous roasts.'
		},
		{
			id: 'pour_over',
			title: 'Pour Over (V60)',
			emoji: '🫖',
			difficulty: 'Beginner',
			time: '4–5 min',
			machineTypes: ['pour_over'],
			equipment: ['V60 dripper + paper filter', 'Gooseneck kettle', 'Scale', 'Timer', 'Fresh medium-fine grind'],
			steps: [
				{ step: 1, title: 'Rinse filter',       time: 0,  desc: 'Place paper filter in V60, rinse with hot water to remove paper taste. Discard rinse water.' },
				{ step: 2, title: 'Add 15g coffee',     time: 0,  desc: 'Add 15g of medium-fine ground coffee (sea salt texture). Shake to level the bed.' },
				{ step: 3, title: 'Bloom 30s',          time: 30, desc: 'Pour 30g of 93°C water evenly over grounds. Wait 30 seconds — the coffee will bloom and degas.' },
				{ step: 4, title: 'Pour to 150g',       time: 45, desc: 'Pour slowly in a circular motion to 150g over ~45 seconds. Keep water level steady.' },
				{ step: 5, title: 'Final pour to 250g', time: 60, desc: 'Continue pouring to 250g total. Total draw-down should finish by 3:30–4:30.' },
				{ step: 6, title: 'Log your brew',      time: 0,  desc: 'Record brew ratio (1:16.7), time, and tasting notes in Beanery.' }
			],
			beginnerTip: 'Use a 1:16 ratio (15g coffee : 240g water). Grind medium-fine — like coarse sand. Slow, steady pours beat fast and choppy.',
			expertTip: 'Try a 4:6 method (Tetsu Kasuya): split into 5 pours of 80g each, 45 seconds apart. First 2 pours control sweetness/acidity, last 3 control strength.'
		},
		{
			id: 'aeropress',
			title: 'AeroPress',
			emoji: '🟡',
			difficulty: 'Beginner',
			time: '2–3 min',
			machineTypes: ['aeropress'],
			equipment: ['AeroPress + paper filter', 'Scale', 'Kettle', 'Cup or server'],
			steps: [
				{ step: 1, title: 'Prep and preheat',   time: 0,  desc: 'Wet the paper filter in the cap, attach to AeroPress, set on a sturdy mug.' },
				{ step: 2, title: 'Add 15g coffee',     time: 0,  desc: 'Add 15g of medium-fine ground coffee to the AeroPress.' },
				{ step: 3, title: 'Add 200g water',     time: 0,  desc: 'Pour 200g of 88°C water. Give it a 10-second stir.' },
				{ step: 4, title: 'Steep 1 minute',     time: 60, desc: 'Put the plunger just into the top (inverted method: flip now). Steep for 1 minute.' },
				{ step: 5, title: 'Press slowly',       time: 30, desc: 'Press the plunger down over ~30 seconds with gentle pressure. Stop when you hear a hiss.' },
				{ step: 6, title: 'Dilute if needed',   time: 0,  desc: 'Add hot water to taste. AeroPress makes a concentrate — dilute 1:1 for a long coffee.' }
			],
			beginnerTip: 'AeroPress is very forgiving. Start with 15g / 200g water / 88°C / 1 min steep. Adjust grind finer for more intensity, coarser for lighter.',
			expertTip: 'Try the Hario-style inverted method for full immersion. Or experiment with cooler water (80°C) for naturally processed beans to highlight fruit notes.'
		},
		{
			id: 'french_press',
			title: 'French Press',
			emoji: '🫘',
			difficulty: 'Beginner',
			time: '4–5 min',
			machineTypes: ['french_press'],
			equipment: ['French press', 'Coarse grinder', 'Scale', 'Timer', 'Kettle'],
			steps: [
				{ step: 1, title: 'Preheat press',      time: 0,  desc: 'Rinse French press with hot water to preheat. Discard.' },
				{ step: 2, title: 'Add 30g coarse',     time: 0,  desc: 'Add 30g of coarsely ground coffee (sea salt / breadcrumb texture).' },
				{ step: 3, title: 'Pour 500g water',    time: 0,  desc: 'Add 500g of 93°C water. Ensure all grounds are saturated. Stir gently.' },
				{ step: 4, title: 'Steep 4 minutes',    time: 240,desc: 'Place the lid on (plunger up). Wait exactly 4 minutes.' },
				{ step: 5, title: 'Break crust, skim',  time: 30, desc: 'Break the crust with a spoon and skim the foam. Wait 30s for grounds to settle.' },
				{ step: 6, title: 'Press and pour',     time: 0,  desc: 'Press the plunger slowly down. Pour immediately — do not let it sit or it will over-extract.' }
			],
			beginnerTip: 'Use a 1:16 ratio (30g : 500g). Coarse grind is essential — fine grounds make it muddy and bitter. Use freshly boiled water cooled for 30s.',
			expertTip: 'Skim the foam and break the crust, then wait 5 minutes instead of 4. You get a cleaner cup. Also try a lower ratio (1:12) for a more intense brew.'
		},
		{
			id: 'moka_pot',
			title: 'Moka Pot',
			emoji: '💧',
			difficulty: 'Beginner',
			time: '5–7 min',
			machineTypes: ['moka_pot'],
			equipment: ['Moka pot (stovetop)', 'Stove', 'Scale', 'Pre-boiled water'],
			steps: [
				{ step: 1, title: 'Add hot water',      time: 0, desc: 'Fill the lower chamber with pre-boiled water to just below the safety valve.' },
				{ step: 2, title: 'Add coffee',         time: 0, desc: 'Add finely ground coffee to the filter basket. Level off — do not tamp.' },
				{ step: 3, title: 'Assemble tightly',   time: 0, desc: 'Screw the upper and lower chambers together tightly.' },
				{ step: 4, title: 'Heat on low/medium', time: 0, desc: 'Place on stove, medium-low heat. Keep the lid open to monitor.' },
				{ step: 5, title: 'Listen for gurgle',  time: 0, desc: 'When coffee stops flowing and you hear a gurgling hiss, remove from heat.' },
				{ step: 6, title: 'Pour immediately',   time: 0, desc: 'Pour right away. Running the base under cold water stops the extraction.' }
			],
			beginnerTip: 'Use pre-boiled water — cold water takes too long and over-extracts. Low heat = better flavour. Grind medium-fine, not espresso-fine.',
			expertTip: 'Moka pot coffee is not espresso — it brews at 1–2 bar, not 9. Try it as a base for lattes or diluted with equal hot water for a "Moka Americano".'
		},
		{
			id: 'cold_brew',
			title: 'Cold Brew',
			emoji: '🧊',
			difficulty: 'Beginner',
			time: '12–24 hours',
			machineTypes: ['cold_brew'],
			equipment: ['Large jar / pitcher', 'Coarse grinder', 'Coffee filter or cheesecloth', 'Refrigerator'],
			steps: [
				{ step: 1, title: 'Coarse grind 80g',   time: 0, desc: 'Grind 80g of coffee very coarsely — like raw sugar.' },
				{ step: 2, title: 'Add cold water',      time: 0, desc: 'Add 1 litre of cold, filtered water. Stir to saturate all grounds.' },
				{ step: 3, title: 'Refrigerate 12–24h', time: 0, desc: 'Cover and refrigerate. 12h for lighter concentrate, 18–24h for stronger.' },
				{ step: 4, title: 'Strain twice',        time: 0, desc: 'Strain through a coffee filter or cheesecloth into a clean bottle.' },
				{ step: 5, title: 'Dilute to serve',     time: 0, desc: 'Cold brew concentrate: dilute 1:1 with water or milk. Serve over ice.' },
				{ step: 6, title: 'Keeps 2 weeks',       time: 0, desc: 'Refrigerate and use within 2 weeks for best flavour.' }
			],
			beginnerTip: 'Cold brew is very forgiving. If it tastes weak, use less water or steep longer. Too strong? Dilute more. Use medium-dark roasts for classic cold brew.',
			expertTip: 'Try a 1:6 ratio (80g : 480ml) for super-concentrate. Dilute 1:3 for a perfect iced coffee. Or use milk instead of water for a creamy cold brew latte.'
		}
	];

	let selectedId = $state('espresso');
	const guide = $derived(GUIDES.find((g) => g.id === selectedId) ?? GUIDES[0]);
	const diffColor = (d: string) =>
		d === 'Beginner' ? 'text-green-600 bg-green-50' : d === 'Intermediate' ? 'text-crema-gold bg-crema-gold/10' : 'text-error bg-error/5';
</script>

<svelte:head>
	<title>Brewing Guides | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Header -->
		<header class="mb-10" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Learn & Brew</p>
			<h1 class="text-headline-xl text-primary">Brewing Guides</h1>
			<p class="text-body-lg mt-2 text-on-surface-variant">Step-by-step instructions for every brew method.</p>
		</header>

		<div class="grid grid-cols-1 gap-gutter lg:grid-cols-12">

			<!-- Guide selector -->
			<nav class="flex flex-row flex-wrap gap-2 lg:col-span-3 lg:flex-col lg:flex-nowrap" use:reveal={0}>
				{#each GUIDES as g}
					<button
						onclick={() => (selectedId = g.id)}
						class="flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 active:scale-[0.98]
							{selectedId === g.id ? 'border-crema-gold bg-crema-gold/5 shadow-sm font-semibold' : 'border-outline-variant/20 bg-surface-container-low hover:border-crema-gold/40 text-on-surface-variant'}"
					>
						<span class="text-xl flex-shrink-0">{g.emoji}</span>
						<span class="text-body-md">{g.title}</span>
					</button>
				{/each}
			</nav>

			<!-- Guide content -->
			<div class="lg:col-span-9" use:reveal={100}>
				<div class="rounded-xl border border-primary/5 bg-surface-container-low p-6 md:p-8" style="animation: fadeGuide 0.25s ease-out">

					<!-- Guide header -->
					<div class="mb-8 flex flex-wrap items-start justify-between gap-4">
						<div>
							<span class="text-4xl">{guide.emoji}</span>
							<h2 class="mt-2 text-headline-lg">{guide.title}</h2>
						</div>
						<div class="flex flex-wrap gap-2">
							<span class="rounded-full px-3 py-1 text-label-sm font-semibold {diffColor(guide.difficulty)}">{guide.difficulty}</span>
							<span class="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant">
								<span class="material-symbols-outlined text-[14px]">schedule</span>
								{guide.time}
							</span>
						</div>
					</div>

					<!-- Equipment -->
					<div class="mb-8">
						<p class="text-label-caps mb-3 text-crema-gold">Equipment Needed</p>
						<div class="flex flex-wrap gap-2">
							{#each guide.equipment as item}
								<span class="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-label-sm text-on-surface-variant">
									<span class="material-symbols-outlined text-[14px] text-crema-gold">check</span>
									{item}
								</span>
							{/each}
						</div>
					</div>

					<!-- Steps -->
					<div class="mb-8">
						<p class="text-label-caps mb-4 text-crema-gold">Step-by-Step</p>
						<div class="relative">
							<div class="absolute left-[18px] top-5 bottom-5 w-px bg-outline-variant/20"></div>
							<div class="space-y-5">
								{#each guide.steps as step}
									<div class="flex gap-4">
										<div class="relative flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-label-sm font-bold z-10">
											{step.step}
										</div>
										<div class="flex-1 pb-2">
											<div class="flex items-center gap-3 mb-1">
												<p class="text-body-md font-semibold">{step.title}</p>
												{#if step.time > 0}
													<span class="flex items-center gap-1 rounded-full bg-crema-gold/10 px-2.5 py-0.5 text-label-caps text-crema-gold">
														<span class="material-symbols-outlined text-[12px]">timer</span>
														{step.time}s
													</span>
												{/if}
											</div>
											<p class="text-body-md text-on-surface-variant">{step.desc}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Tips -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div class="rounded-xl bg-green-50 border border-green-200/50 p-5">
							<div class="flex items-center gap-2 mb-2">
								<span class="material-symbols-outlined text-green-600 text-[18px]">school</span>
								<p class="text-label-caps text-green-700">Beginner Tip</p>
							</div>
							<p class="text-body-md text-green-800">{guide.beginnerTip}</p>
						</div>
						<div class="rounded-xl bg-crema-gold/5 border border-crema-gold/20 p-5">
							<div class="flex items-center gap-2 mb-2">
								<span class="material-symbols-outlined text-crema-gold text-[18px]">workspace_premium</span>
								<p class="text-label-caps text-crema-gold">Expert Tip</p>
							</div>
							<p class="text-body-md text-on-surface-variant">{guide.expertTip}</p>
						</div>
					</div>

					<!-- Link to log -->
					<div class="mt-6 pt-6 border-t border-outline-variant/10 flex justify-end">
						<a href="/shot-logger"
							class="text-label-caps flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-white uppercase tracking-widest transition-all hover:bg-crema-gold hover:shadow-lg active:scale-95">
							<span class="material-symbols-outlined text-[18px]">coffee</span>
							Log a {guide.title}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fadeGuide {
		from { opacity: 0; transform: translateY(6px); }
		to   { opacity: 1; transform: translateY(0); }
	}
</style>
