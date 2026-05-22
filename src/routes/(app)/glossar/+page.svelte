<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	interface Term {
		term: string;
		category: string;
		def: string;
		why: string;
		tip: string;
		link?: string;
		linkLabel?: string;
	}

	const TERMS: Term[] = [
		{ term: 'Dose',          category: 'Measurement', def: 'The weight of dry ground coffee placed in the portafilter or brewer, measured in grams.',                                                     why: 'Dose directly controls how strong and intense the resulting coffee will be.',                                    tip: 'Start at 18g for a double espresso. Small changes (±0.5g) have a noticeable impact on flavour.', link: '/shot-logger', linkLabel: 'Log a shot' },
		{ term: 'Yield',         category: 'Measurement', def: 'The weight of liquid coffee that ends up in your cup, measured in grams.',                                                                    why: 'Combined with dose, yield determines Brew Ratio — the key quality indicator.',                               tip: 'Aim for 36g yield with 18g dose for a classic 1:2 ratio espresso.', link: '/shot-logger', linkLabel: 'Log a shot' },
		{ term: 'Brew Ratio',    category: 'Measurement', def: 'Yield divided by Dose. A 1:2 ratio means 18g in → 36g out.',                                                                                why: 'Brew ratio is the single most important variable for consistent espresso quality.',                            tip: '1:1.5 = Ristretto (intense). 1:2 = Normale (balanced). 1:3 = Lungo (lighter). Beanery calculates this live.', link: '/shot-logger', linkLabel: 'See live ratio' },
		{ term: 'Extraction',    category: 'Science',     def: 'The process of dissolving flavour compounds from coffee grounds into water.',                                                                 why: 'Everything tastes under-extracted (sour, weak) or over-extracted (bitter, dry) if not optimised.',            tip: 'Target 18–22% extraction yield for espresso. Adjust grind size to control it.' },
		{ term: 'TDS',           category: 'Science',     def: 'Total Dissolved Solids — the concentration of coffee compounds in the liquid, measured as a percentage.',                                    why: 'TDS tells you how strong the coffee is, independent of the amount.',                                         tip: 'Espresso: 8–12% TDS. Filter coffee: 1.2–1.5%. Use a refractometer to measure.' },
		{ term: 'Grind Size',    category: 'Extraction',  def: 'The particle size of ground coffee, controlled by the grinder setting.',                                                                     why: 'Finer grind = slower flow, more contact time, more extraction. Coarser = faster, less extraction.',           tip: 'If your shot runs too fast, grind finer. Too slow, grind coarser. Change by 1 click at a time.', link: '/shot-logger', linkLabel: 'Log grind size' },
		{ term: 'Tamping',       category: 'Technique',   def: 'Compressing the coffee puck in the portafilter with a tamper, using approximately 15kg of pressure.',                                       why: 'Even tamping prevents channelling and ensures uniform water flow through the puck.',                          tip: 'Focus on evenness, not force. Tamp straight down — a tilted puck causes uneven extraction.' },
		{ term: 'Channelling',   category: 'Defect',      def: 'When water finds a path of least resistance through the coffee puck rather than flowing evenly.',                                           why: 'Channelling causes uneven extraction: some grounds over-extract while others under-extract.',                  tip: 'Symptoms: blonding too early, sour/bitter mix, light streaks in the cup. Fix: even distribution before tamping.' },
		{ term: 'Bloom',         category: 'Technique',   def: 'A short pre-infusion in pour over: pouring a small amount of water (2× coffee weight) to wet the grounds and release CO₂.',               why: 'Fresh coffee releases CO₂ gas which inhibits even extraction. Blooming lets gas escape first.',               tip: 'Pour 30g water for 30g coffee, wait 30–45s. Bubbling = fresh coffee. No bubbles = stale beans.' },
		{ term: 'Preinfusion',   category: 'Technique',   def: 'In espresso: applying low pressure (1–4 bar) before full pressure to gently saturate the puck.',                                           why: 'Reduces channelling on light, porous roasts and leads to more even extraction.',                              tip: 'Many modern machines have built-in pre-infusion. Try 5–8 seconds at low pressure before full 9 bar.' },
		{ term: 'Crema',         category: 'Quality',     def: 'The golden-brown foam on top of espresso, created by CO₂ emulsified during high-pressure extraction.',                                     why: 'Crema indicates freshness (CO₂ = recent roast) and proper extraction pressure.',                             tip: 'Thick, hazelnut-coloured crema = good sign. Pale = under-extraction or stale. Dark = over-extraction.' },
		{ term: 'Single Origin', category: 'Beans',       def: 'Coffee from a specific country, region, or farm — not blended with other origins.',                                                         why: 'Highlights the unique terroir and processing character of one place.',                                       tip: 'Great for exploring flavour diversity. More sensitive to extraction variables than blends.' },
		{ term: 'Blend',         category: 'Beans',       def: 'Coffee combining beans from multiple origins, often designed for consistency and balance as espresso.',                                     why: 'Blends are more forgiving and consistent across seasons and extractions.',                                    tip: 'Most commercial espresso uses blends. If you want repeatable results day to day, start with a blend.' },
		{ term: 'Washed',        category: 'Processing',  def: 'Coffee processing method where the fruit (mucilage) is washed off before drying.',                                                          why: 'Produces cleaner, brighter, more acidic cups — the "true terroir" of the bean.',                             tip: 'Washed coffees are very sensitive to temperature. Try 92–95°C to highlight acidity and clarity.' },
		{ term: 'Natural',       category: 'Processing',  def: 'Processing where coffee cherries dry with the fruit intact, absorbing sugars into the bean.',                                               why: 'Creates fruity, wine-like, full-bodied flavours with lower acidity.',                                        tip: 'Try slightly lower temperatures (88–92°C) for natural process to avoid harsh bitterness.' },
		{ term: 'Honey Process', category: 'Processing',  def: 'A hybrid between washed and natural: some mucilage left on the bean during drying.',                                                        why: 'Combines brightness of washed with sweetness/body of natural.',                                              tip: 'Yellow honey = cleaner, Red/Black honey = more fruity and full-bodied.' },
		{ term: 'Light Roast',   category: 'Roast',       def: 'Roasted to first crack only. High acidity, fruit/floral notes, preserves origin character.',                                               why: 'Best showcases terroir and processing. More caffeine than dark roasts.',                                      tip: 'Needs higher extraction temp (93–96°C) and finer grind. More challenging to extract well.' },
		{ term: 'Dark Roast',    category: 'Roast',       def: 'Roasted past second crack. Low acidity, bitter/chocolatey notes, less origin character.',                                                  why: 'More soluble, easier to extract. Consistent flavour regardless of origin.',                                  tip: 'Use lower temperature (88–92°C) to avoid harsh bitterness. Coarser grind than light roast.' },
		{ term: 'Dialing In',    category: 'Technique',   def: 'The iterative process of adjusting grind, dose, and yield until an espresso shot tastes perfect.',                                          why: 'Every new bag of coffee needs dialing in — roast date, humidity, and bean density all change things.',        tip: 'Start with a known good recipe, change only one variable at a time, and taste every shot.', link: '/shot-logger', linkLabel: 'Start logging' },
		{ term: 'Sweet Spot',    category: 'Technique',   def: 'The optimal combination of grind, dose, yield, and time that produces the best-tasting shot for a given bean.',                           why: 'Finding the sweet spot is the goal of dialing in.',                                                          tip: 'Beanery\'s Brew Ratio Recommendations show your sweet spot after 3+ shots on the same bean.', link: '/library', linkLabel: 'See Bean Library' },
		{ term: 'Ristretto',     category: 'Recipe',      def: 'Restricted espresso: same dose but lower yield (1:1 or 1:1.5). Intense, sweet, syrupy.',                                                  why: 'More concentrated, often sweeter and less bitter than normale. Popular in specialty coffee.',                 tip: 'Use the same grind and temp, just stop earlier at ~25–27g yield from 18g dose.' },
		{ term: 'Normale',       category: 'Recipe',      def: 'Standard espresso: 1:2 ratio. 18g dose → 36g yield in 25–35 seconds.',                                                                    why: 'The industry standard reference point for espresso quality.',                                                tip: 'This is your baseline. Once you can make a consistent normale, experiment from there.' },
		{ term: 'Lungo',         category: 'Recipe',      def: 'Long pull: 1:3 or 1:4 ratio. Diluted, lighter, more bitter.',                                                                              why: 'Higher yield extracts more bitter compounds. Useful for milk-based drinks.',                                 tip: 'Lungo ≠ Americano. Americano = espresso + hot water added after. Lungo = longer extraction.' },
		{ term: 'Specialty Coffee', category: 'Industry', def: 'Coffee scoring 80+ on the SCA 100-point scale. Traceable origin, carefully processed, professionally roasted.',                           why: 'The top tier of coffee quality — what most third-wave coffee shops serve.',                                   tip: 'Most beans in Beanery\'s library are specialty grade. Look for transparent roasters with farm information.' },
		{ term: 'SCA',           category: 'Industry',   def: 'Specialty Coffee Association — the global industry body that sets standards for coffee quality and barista skills.',                         why: 'SCA defines what "specialty" means and runs the Q Grader and barista certification programs.',               tip: 'The SCA Flavour Wheel is the industry standard for describing coffee flavours — used in Beanery.' },
		{ term: 'Portafilter',   category: 'Equipment',  def: 'The handle-and-basket assembly that holds coffee grounds and locks into the espresso machine group head.',                                  why: 'The portafilter is where extraction happens — temperature and cleanliness affect every shot.',                tip: 'Keep it clean and warm. Cold portafilter = temperature shock = under-extraction.' },
		{ term: 'Puck',          category: 'Equipment',  def: 'The compressed disc of spent coffee grounds after an espresso extraction.',                                                                  why: 'A good puck is firm, dry, and holds its shape — indicating even extraction.',                                tip: 'Wet, soupy puck = grind too coarse or extraction too short. Dry, cracked puck = grind too fine.' }
	];

	const CATEGORIES = [...new Set(TERMS.map((t) => t.category))].sort();

	let search = $state('');
	let activeCategory = $state('All');

	const filtered = $derived(
		TERMS.filter((t) => {
			const matchSearch = !search.trim() || t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase());
			const matchCat = activeCategory === 'All' || t.category === activeCategory;
			return matchSearch && matchCat;
		})
	);

	const catColor: Record<string, string> = {
		Measurement: 'bg-blue-50 text-blue-700',
		Science:     'bg-purple-50 text-purple-700',
		Technique:   'bg-green-50 text-green-700',
		Defect:      'bg-red-50 text-red-700',
		Quality:     'bg-crema-gold/10 text-crema-gold',
		Beans:       'bg-amber-50 text-amber-700',
		Processing:  'bg-orange-50 text-orange-700',
		Roast:       'bg-gray-100 text-gray-700',
		Recipe:      'bg-indigo-50 text-indigo-700',
		Industry:    'bg-teal-50 text-teal-700',
		Equipment:   'bg-slate-100 text-slate-700'
	};
</script>

<svelte:head>
	<title>Coffee Glossar | Beanery</title>
</svelte:head>

<div class="grain-texture" aria-hidden="true"></div>

<div class="px-container-padding pb-28 pt-10 md:px-12 md:pt-14">
	<div class="mx-auto max-w-[1100px]">

		<!-- Header -->
		<header class="mb-8" use:reveal={0}>
			<p class="text-label-caps mb-2 text-crema-gold">Learn the Language</p>
			<h1 class="text-headline-xl text-primary">Coffee Glossar</h1>
			<p class="text-body-lg mt-2 text-on-surface-variant">{TERMS.length} coffee terms explained — from beginner to expert.</p>
		</header>

		<!-- Search + filters -->
		<div class="mb-8 space-y-4" use:reveal={100}>
			<!-- Search -->
			<div class="relative max-w-md">
				<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/50">search</span>
				<input
					type="text"
					placeholder="Search terms…"
					bind:value={search}
					class="text-body-md w-full rounded-full border border-outline-variant/30 bg-surface-bright py-3 pl-11 pr-4 outline-none transition-colors focus:ring-2 focus:ring-crema-gold/60"
				/>
				{#if search}
					<button onclick={() => (search = '')} class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface">
						<span class="material-symbols-outlined text-[18px]">close</span>
					</button>
				{/if}
			</div>

			<!-- Category filters -->
			<div class="flex flex-wrap gap-2">
				<button onclick={() => (activeCategory = 'All')}
					class="rounded-full px-4 py-1.5 text-label-sm transition-all {activeCategory === 'All' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}">
					All ({TERMS.length})
				</button>
				{#each CATEGORIES as cat}
					<button onclick={() => (activeCategory = cat)}
						class="rounded-full px-4 py-1.5 text-label-sm transition-all {activeCategory === cat ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}">
						{cat} ({TERMS.filter((t) => t.category === cat).length})
					</button>
				{/each}
			</div>
		</div>

		<!-- Terms grid -->
		{#if filtered.length === 0}
			<div class="flex flex-col items-center py-16 text-center">
				<span class="material-symbols-outlined mb-4 text-[48px] text-crema-gold/30">search_off</span>
				<p class="text-body-md text-on-surface-variant">No terms match "<em>{search}</em>"</p>
				<button onclick={() => { search = ''; activeCategory = 'All'; }} class="mt-4 text-label-sm text-crema-gold underline">Clear filters</button>
			</div>
		{:else}
			<p class="text-label-caps mb-4 text-on-surface-variant/40">{filtered.length} term{filtered.length !== 1 ? 's' : ''}</p>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2" use:reveal={150}>
				{#each filtered as t}
					<div class="group rounded-xl border border-primary/5 bg-surface-container-low p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-crema-gold/20 hover:shadow-md">
						<div class="mb-3 flex items-start justify-between gap-3">
							<h3 class="text-headline-md leading-tight">{t.term}</h3>
							<span class="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider {catColor[t.category] ?? 'bg-surface-container text-on-surface-variant'}">{t.category}</span>
						</div>

						<p class="text-body-md text-on-surface-variant mb-4">{t.def}</p>

						<div class="space-y-2.5">
							<div class="flex gap-2">
								<span class="material-symbols-outlined flex-shrink-0 mt-0.5 text-crema-gold text-[16px]">lightbulb</span>
								<p class="text-label-sm text-on-surface-variant/70"><span class="font-semibold text-on-surface">Why it matters:</span> {t.why}</p>
							</div>
							<div class="flex gap-2">
								<span class="material-symbols-outlined flex-shrink-0 mt-0.5 text-green-600 text-[16px]">school</span>
								<p class="text-label-sm text-on-surface-variant/70"><span class="font-semibold text-on-surface">Beginner tip:</span> {t.tip}</p>
							</div>
						</div>

						{#if t.link}
							<a href={t.link}
								class="mt-4 flex items-center gap-1.5 text-label-sm text-crema-gold transition-colors hover:underline">
								<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
								{t.linkLabel}
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
