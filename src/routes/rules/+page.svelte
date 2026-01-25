<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type {
		Artifact,
		Rune,
		TTSExportData,
		ScreenshotAsset,
		HexSpirit,
		IconGuideIcon,
		IconPoolItem
	} from '$lib/data/types';

	let { data } = $props<{ data: PageData }>();
	const tts = $derived(data.tts) as TTSExportData | null;

	let activeSection = $state('overview');
	let tocOpen = $state(false);
	let scrollY = $state(0);

	const statusLabels = ['Pure', 'Tainted', 'Corrupt', 'Fallen'] as const;

	function buildOriginsById(origins: { id: string; name: string; icon_url: string | null; color: string | null }[]) {
		return new Map(origins.map((o) => [o.id, o]));
	}

	const originsById = $derived.by(() =>
		tts
			? buildOriginsById(tts.origins)
			: new Map<string, { id: string; name: string; icon_url: string | null; color: string | null }>()
	);

	const iconGuideIconsSorted = $derived.by(() =>
		tts ? [...tts.icon_guide_icons].sort((a, b) => a.position - b.position) : []
	);

	type IconGuideGroup = { group: string; icons: IconGuideIcon[] };
	const iconGuideGroups = $derived.by(() => {
		if (!tts) return [] as IconGuideGroup[];

		const groups = new Map<string, IconGuideIcon[]>();
		for (const icon of tts.icon_guide_icons) {
			const group = icon.group?.trim() || 'Other';
			const list = groups.get(group);
			if (list) list.push(icon);
			else groups.set(group, [icon]);
		}

		const groupOrder = ['Action', 'Combat', 'Resource'];
		const rank = (group: string) => {
			const idx = groupOrder.indexOf(group);
			return idx === -1 ? groupOrder.length : idx;
		};

		return [...groups.entries()]
			.map(([group, icons]) => ({
				group,
				icons: [...icons].sort((a, b) => a.position - b.position)
			}))
			.sort((a, b) => rank(a.group) - rank(b.group) || a.group.localeCompare(b.group));
	});

	const artifactExamples = $derived.by(() => {
		if (!tts) return [] as Artifact[];
		const isPocketOfVoid = (name: string) => name.trim().toLowerCase() === 'pocket of void';
		const candidates = tts.artifacts.filter((a) => !isPocketOfVoid(a.name));
		const withImages = candidates.filter((a) => a.image_path);
		if (withImages.length >= 2) return withImages.slice(0, 2);
		return candidates.slice(0, 2);
	});

	const guardianMatExample = $derived.by(() => {
		if (!tts) return null as TTSExportData['guardians'][number] | null;
		const withMats = tts.guardians.filter((g) => g.mat_image_url);
		if (withMats.length === 0) return null;
		return withMats.sort((a, b) => a.name.localeCompare(b.name))[0];
	});

	const guardianChibiExample = $derived.by(() => {
		if (!tts) return null as TTSExportData['guardians'][number] | null;
		const withChibi = tts.guardians.filter((g) => g.chibi_image_url);
		if (withChibi.length === 0) return null;
		return withChibi.sort((a, b) => a.name.localeCompare(b.name))[0];
	});

	const coreRuneExamples = $derived.by(() => {
		if (!tts) return [] as Rune[];
		return tts.runes.filter((r) => r.type === 'origin' && r.icon_url).slice(0, 2);
	});

	const coreAugmentExamples = $derived.by(() => {
		if (!tts) return [] as Rune[];
		return tts.runes.filter((r) => r.type === 'class' && r.icon_url).slice(0, 2);
	});

		const coreSpiritExamples = $derived.by(() => {
			if (!tts) return [] as HexSpirit[];
			const seen = new Set<string>();
			const result: HexSpirit[] = [];
			for (const spirit of tts.hex_spirits) {
				if (seen.has(spirit.name)) continue;
				seen.add(spirit.name);
				result.push(spirit);
				if (result.length >= 2) break;
			}
			return result;
		});

		const coreResourceExamples = $derived.by(() => {
			if (!tts) return [] as IconGuideIcon[];
			const desired = ['victory point', 'gain 1 barrier', 'arcane blood'];
			const byLowerName = new Map(iconGuideIconsSorted.map((i) => [i.name.toLowerCase(), i]));
			return desired
				.map((n) => byLowerName.get(n))
				.filter((i): i is IconGuideIcon => Boolean(i?.image_url));
		});

		const coreStatusTileExamples = $derived.by(() => {
			if (!tts) return [] as IconPoolItem[];
			const status = tts.icon_pool
				.filter((i) => i.image_url && (i.tags ?? []).includes('status'))
				.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
			return status.slice(0, 1);
		});

		const statusTrackTiles = $derived.by(() => {
			if (!tts) return [] as IconPoolItem[];
			return tts.icon_pool
				.filter((i) => i.image_url && (i.tags ?? []).includes('status'))
				.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
				.slice(0, 4);
		});

	const ttsScreenshotCaptions: Record<string, string> = {
		'1_mod_load': 'Wait for the mod to load',
		'2_chara_select': 'Select a character',
		'3_player_mat': 'Player mat & UI'
	};

	type TtsScreenshot = ScreenshotAsset & { caption: string };
	const playerMatScreenshot = $derived.by(() => {
		if (!tts) return null as TtsScreenshot | null;
		const s = (tts.screenshots ?? []).find((shot) => shot.name === '3_player_mat');
		if (!s) return null;
		return {
			...s,
			caption: ttsScreenshotCaptions[s.name] ?? s.name.replaceAll('_', ' ')
		};
	});

	const spiritWorldBoard = $derived.by(() => {
		if (!tts) return null;
		return (
			tts.boards.find((b) => b.name.toLowerCase() === 'spiritworld') ??
			tts.boards.find((b) => b.name.toLowerCase().includes('spirit'))
		);
	});

	// Terminology Data
	type TermItem = { term: string; definition: string };
	const terminologyData: Record<string, TermItem[]> = {
		overview: [
			{
				term: 'Stage',
				definition: 'Arc Spirits takes place over the course of Stages, where event cards and monsters are drawn from a limited, preset Stage deck. Throughout the game, players will be defeating monsters, encountering events, and the game ends when the last stage card has been drawn.'
			}
		],
		'spirit-world': [
			{
				term: 'Location',
				definition: 'A space on the Spirit World board where players can move to resolve benefits or fight monsters.'
			}
		],
		'game-flow': [
			{
				term: 'Stage Deck',
				definition: 'A preset, ordered collection of cards belonging to the specific Scenario you are playing.'
			},
			{
				term: 'Round',
				definition: 'A single cycle where all players simultaneously choose their actions, then resolve them together.'
			},
			{
				term: 'Event Card',
				definition: 'A Stage Deck card that triggers story events and often instructs you how to place Location Cards.'
			},
			{
				term: 'Monster Card',
				definition: 'A Stage Deck card representing an enemy. Place it at the location indicated by its Invade Location.'
			},
			{
				term: 'Location Card',
				definition: 'A Stage Deck card that adds or modifies locations on the Spirit World board.'
			}
		],
		combat: [
			{
				term: 'Combatant',
				definition: 'A player with at least 1 Barrier who participates in combat.'
			},
			{
				term: 'Counterattack',
				definition: 'The enemy attacks back after players deal damage, even if the enemy is defeated.'
			}
		],
		'player-mat': [
			{
				term: 'Spirit Tableau',
				definition: 'The hex grid on your player mat where you place summoned spirits.'
			}
		],
		'icon-reference': [
			{
				term: 'Icons',
				definition: 'Visual symbols representing actions, resources, and spirit traits throughout the game.'
			}
		]
	};

	// FAQ Data
	type FaqItem = { question: string; answer: string };
	const faqData: Record<string, FaqItem[]> = {
		overview: [
			{
				question: 'How many players can play Arc Spirits?',
				answer: 'Arc Spirits supports 1-6 players. The game scales well across all player counts with simultaneous play keeping downtime minimal.'
			},
			{
				question: "What's the win condition?",
				answer: 'The game ends when the Stage 4 boss is defeated. The player with the most Victory Points (VP) wins.'
			},
			{
				question: 'Is this a cooperative or competitive game?',
				answer: "It's competitive overall, but combat against monsters is cooperative. Players at the same location fight together and share rewards, but ultimately compete for the highest VP."
			},
			{
				question: 'How long does a typical game take?',
				answer: 'A full game typically takes 60-120 minutes depending on player count and familiarity with the rules.'
			}
		],
		'spirit-world': [
			{
				question: 'Can I stay at the same location?',
				answer: 'Yes, you can choose not to move and stay at your current location to resolve its benefits again (if no monster blocks it).'
			},
			{
				question: 'What if multiple players go to the same location?',
				answer: "If there's a monster, you fight together cooperatively. For reward rows, each player resolves them independently—there's no blocking or competition."
			},
			{
				question: 'What are the different location types?',
				answer: 'Most locations have Gain rows (free resources) and Trade rows (spend to gain). The Arcane Abyss is special—it holds boss monsters and has unique rewards.'
			}
		],
		'game-flow': [
			{
				question: 'What happens when a boss is defeated?',
				answer: 'For Stages 1-3, the current stage ends and the next stage begins with new monsters. For Stage 4, defeating the boss ends the game immediately.'
			},
			{
				question: 'Can I skip combat?',
				answer: "If you have 0 Barriers (HP), you cannot be a combatant. You won't fight but also won't receive combat rewards. You can still resolve location benefits if the monster is defeated by others."
			},
			{
				question: 'How do Trade rows work?',
				answer: 'Trade rows show a cost (left side) and reward (right side) with an arrow. Pay the cost to gain the reward. Each Trade row can be used once per player per round.'
			},
			{
				question: 'When do unchosen spirits return to bags?',
				answer: 'Spirits you look at but choose not to summon return to the SAME bag they came from (Spirit World Bag or Arcane Abyss Bag).'
			},
			{
				question: 'What is Arcane Blood used for?',
				answer: "Spend Arcane Blood to lower your Corruption Status by one step, gaining the one-time arrow reward shown. This can give you powerful combat dice but reduces your spirit limit."
			}
		],
		'player-mat': [
			{
				question: 'How many spirits can I have?',
				answer: 'Your spirit limit depends on your Corruption Status. Pure allows the most spirits, while Fallen has the lowest limit. Check your mat for exact numbers.'
			},
			{
				question: 'What do artifacts do?',
				answer: 'Artifacts provide persistent upgrades or one-time powerful effects. Each Guardian has unique artifacts that can be crafted by spending the required runes.'
			},
			{
				question: 'How does Corruption Status progression work?',
				answer: 'Status goes: Pure → Tainted → Corrupt → Fallen. Each step down costs Arcane Blood but grants one-time rewards. Corrupt and Fallen also grant permanent Arcane Attack Dice in combat.'
			}
		],
		'icon-reference': [
			{
				question: 'Where can I find icon meanings during play?',
				answer: 'Use the reference sheet included with the game, or check this Icon Reference section. The most important icons are Summon Spirit and Cultivate Spirit.'
			},
			{
				question: 'What do the class icons mean?',
				answer: 'Class icons on spirits determine what abilities they provide. Fighter gives attack dice, Defender gives defense, Support reduces damage, etc.'
			}
		]
	};

	// Map sections to their parent chapter for FAQ display
	const sectionToChapter: Record<string, string> = {
		overview: 'overview',
		'spirit-world': 'spirit-world',
		'game-setup': 'overview',
		'game-flow': 'game-flow',
		'stage-start': 'game-flow',
		'round-loop': 'game-flow',
		'realm-navigation': 'game-flow',
		'encounter-phase': 'game-flow',
		'monster-combat': 'game-flow',
		'reward-rows': 'game-flow',
		'end-of-round': 'game-flow',
		combat: 'combat',
		'combat-overview': 'combat',
		'combatants-phase': 'combat',
		'preparation-phase': 'combat',
		'battle-phase': 'combat',
		'taking-damage': 'combat',
		'reward-phase': 'combat',
		'player-mat-overview': 'player-mat',
		spirits: 'player-mat',
		runes: 'player-mat',
		artifacts: 'player-mat',
		'spirit-status': 'player-mat',
		overflow: 'player-mat',
		'icon-reference': 'icon-reference'
	};

	const currentFaqs = $derived.by(() => {
		const chapter = sectionToChapter[activeSection] || 'overview';
		return faqData[chapter] || faqData['overview'];
	});

	const currentTerms = $derived.by(() => {
		const chapter = sectionToChapter[activeSection] || 'overview';
		return terminologyData[chapter] || terminologyData['overview'];
	});

	type TocItem = {
		id?: string;
		label: string;
		href?: string;
		children?: TocItem[];
	};
	const toc: TocItem[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'spirit-world', label: 'Spirit World' },
		{ id: 'game-setup', label: 'Game Setup' },
		{
			id: 'game-flow',
			label: 'Game Flow',
			children: [
				{ id: 'stage-start', label: '1. Stage Start' },
				{
					id: 'round-loop',
					label: '2. Round Loop',
					children: [
						{ id: 'realm-navigation', label: '2.1 Navigation Phase' },
						{
							id: 'encounter-phase',
							label: '2.2 Encounter Phase',
							children: [
								{ id: 'monster-combat', label: '2.2a Combat Phase' }
							]
						},
						{ id: 'reward-rows', label: '2.3 Location Benefits Phase' },
						{ id: 'end-of-round', label: '2.4 Cleanup Phase' }
					]
				}
			]
		},
		{
			id: 'combat',
			label: 'Initiating Combat',
			children: [
				{ id: 'combat-overview', label: 'Overview' },
				{ id: 'combatants-phase', label: 'Step 1: Determine Combatants' },
				{ id: 'preparation-phase', label: 'Step 2: Preparation' },
				{ id: 'battle-phase', label: 'Step 3: Battle' },
				{ id: 'taking-damage', label: 'Take Damage (Info)' },
				{ id: 'reward-phase', label: 'Step 4: Aftermath' }
			]
		},
		{
			id: 'player-mat-overview',
			label: 'Player Mat',
			children: [
				{ id: 'spirits', label: 'Spirits' },
				{ id: 'runes', label: 'Runes' },
				{ id: 'artifacts', label: 'Artifacts' },
				{ id: 'spirit-status', label: 'Corruption Status' },
				{ id: 'overflow', label: 'Overflow' }
			]
		},
		{ id: 'icon-reference', label: 'Icon Reference' },
		{ label: 'Hex Spirit Table', href: '/rules/hex-spirit-table' },
		{ label: 'Examples', href: '/rules/examples' }
	];

	function flattenTocIds(items: TocItem[]): string[] {
		const result: string[] = [];
		for (const item of items) {
			if (item.id) result.push(item.id);
			if (item.children) result.push(...flattenTocIds(item.children));
		}
		return result;
	}

	function tocContainsId(item: TocItem, id: string): boolean {
		if (item.id === id) return true;
		if (!item.children) return false;
		return item.children.some((child) => tocContainsId(child, id));
	}

	function scrollToSection(id: string) {
		activeSection = id;
		tocOpen = false;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);

		for (const id of flattenTocIds(toc)) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		const handleScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener('scroll', handleScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>Arc Spirits - Full Rules Reference</title>
	<meta name="description" content="Complete rules reference for Arc Spirits tabletop game" />
</svelte:head>

<div class="rules-page" class:scrolled={scrollY > 50}>
	<!-- Background layers -->
	<div class="bg-texture"></div>
	<div class="bg-gradient"></div>
	<div class="diagonal-lines">
		<div class="diag diag-1"></div>
		<div class="diag diag-2"></div>
		<div class="diag diag-3"></div>
	</div>

	<!-- Navigation -->
	<nav class="top-nav">
		<a href="/" class="back-link">
			<span class="back-icon">←</span>
			<span class="back-text">Back to Intro</span>
		</a>
		<button class="toc-toggle" onclick={() => (tocOpen = !tocOpen)}>
			<span class="toggle-icon">{tocOpen ? '✕' : '☰'}</span>
			<span>Contents</span>
		</button>
	</nav>

	<!-- Table of Contents Sidebar -->
	<aside class="toc-sidebar" class:open={tocOpen}>
		<div class="toc-header">
			<div class="toc-ornament">◈</div>
			<h2>Table of Contents</h2>
			<div class="toc-ornament">◈</div>
		</div>
		<nav class="toc-nav">
			<ol class="toc-list">
				{#each toc as item (item.id ?? item.label)}
					<li>
						{#if item.href}
							<a class="toc-link" href={item.href}>
								{item.label}
							</a>
						{:else}
							<button
								class="toc-link"
								class:active={item.id ? tocContainsId(item, activeSection) : false}
								onclick={() => item.id && scrollToSection(item.id)}
							>
								{item.label}
							</button>
						{/if}

						{#if item.children?.length}
							<ul class="toc-sublist">
								{#each item.children as child (child.id ?? child.label)}
									<li>
										{#if child.href}
											<a class="toc-sublink" href={child.href}>{child.label}</a>
										{:else}
											<button
												class="toc-sublink"
												class:active={child.id ? tocContainsId(child, activeSection) : false}
												onclick={() => child.id && scrollToSection(child.id)}
											>
												{child.label}
											</button>
										{/if}

										{#if child.children?.length}
											<ul class="toc-sublist">
												{#each child.children as grandchild (grandchild.id ?? grandchild.label)}
													<li>
														{#if grandchild.href}
															<a class="toc-sublink" href={grandchild.href}>{grandchild.label}</a>
														{:else}
															<button
																class="toc-sublink"
																class:active={grandchild.id ? tocContainsId(grandchild, activeSection) : false}
																onclick={() => grandchild.id && scrollToSection(grandchild.id)}
															>
																{grandchild.label}
															</button>
														{/if}

														{#if grandchild.children?.length}
															<ul class="toc-sublist">
																{#each grandchild.children as greatgrandchild (greatgrandchild.id ?? greatgrandchild.label)}
																	<li>
																		{#if greatgrandchild.href}
																			<a class="toc-sublink" href={greatgrandchild.href}>{greatgrandchild.label}</a>
																		{:else}
																			<button
																				class="toc-sublink"
																				class:active={greatgrandchild.id ? tocContainsId(greatgrandchild, activeSection) : false}
																				onclick={() => greatgrandchild.id && scrollToSection(greatgrandchild.id)}
																			>
																				{greatgrandchild.label}
																			</button>
																		{/if}

																		{#if greatgrandchild.children?.length}
																			<ul class="toc-sublist">
																				{#each greatgrandchild.children as ggchild (ggchild.id ?? ggchild.label)}
																					<li>
																						<button
																							class="toc-sublink"
																							class:active={ggchild.id === activeSection}
																							onclick={() => ggchild.id && scrollToSection(ggchild.id)}
																						>
																							{ggchild.label}
																						</button>
																					</li>
																				{/each}
																			</ul>
																		{/if}
																	</li>
																{/each}
															</ul>
														{/if}
													</li>
												{/each}
											</ul>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ol>
		</nav>
	</aside>

	<!-- Mobile TOC Overlay -->
		{#if tocOpen}
			<button class="toc-overlay" aria-label="Close table of contents" onclick={() => (tocOpen = false)}></button>
		{/if}

	<!-- Main Content -->
	<main class="rules-main">
		<div class="rules-layout">
			<!-- Main content column -->
			<div class="rules-content">
		<!-- Overview -->
		<section id="overview" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Overview</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				<p class="tree-intro">
					Arc Spirits is a competitive board game for <strong>1–6 players</strong>, played over four
					escalating stages. The game is <em>parallel / simultaneous</em>: each round, all players
					choose in secret, then resolve together (not sequential turns).
				</p>
				<p class="tree-intro">
					Throughout the four stages of the game you gather spirits to build compositions that generate
					<strong>combat power</strong> and <strong>resources</strong>. Your goal is to defeat monsters,
					score <strong>Victory Points</strong>, and finish with the most VP when the final boss falls.
				</p>

				<div class="callout-box win-condition">
					<div class="callout-icon">🏆</div>
					<div class="callout-content">
						<h4>Win Condition</h4>
						<p>The game ends when the <strong>final stage boss</strong> is defeated.</p>
						<p>Highest <strong>Victory Points (VP)</strong> wins.</p>
					</div>
				</div>

				<div class="note-box">
					<strong>Simultaneous play:</strong> there is no turn order. Players resolve phases in parallel; if multiple
					players share a location, resolve the shared combat together.
				</div>

				<!-- Core Pieces -->
				<div class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Core Pieces</h3>
					</div>
					<div class="subchapter-content">
						<div class="pieces-grid core-pieces-grid">
						<div class="piece-card core-piece-guardians">
							{#if guardianChibiExample?.chibi_image_url}
								<div class="piece-icon piece-icon-example-single">
									<img
										class="example-thumb example-tile example-tile-lg"
										src={guardianChibiExample.chibi_image_url}
										alt={`${guardianChibiExample.name} guardian`}
										width="132"
										height="132"
										loading="lazy"
										decoding="async"
									/>
								</div>
							{:else}
								<div class="piece-icon">☺</div>
							{/if}
							<h4>Guardians</h4>
							<p>
								Characters that players select at the start of the game. Guardians come from different
								Origins and have their own unique Artifacts.
							</p>
						</div>
						<div class="piece-card core-piece-player-mat">
							{#if guardianMatExample?.mat_image_url}
								<div class="piece-icon piece-icon-example-single core-mat-media">
									<img
										class="example-thumb example-mat core-mat-img"
										src={guardianMatExample.mat_image_url}
										alt={`${guardianMatExample.name} player mat`}
										loading="lazy"
										decoding="async"
									/>
								</div>
							{:else}
								<div class="piece-icon">⬡</div>
							{/if}
							<h4>Player Mat</h4>
							<p>
								A board where you can play up to 7 Hex Spirits into your Spirit Tableau, keep track of your
								Corruption Status, rune tokens, barrier tokens, and place attack dice.
							</p>
						</div>
						<div class="piece-card">
							{#if tts}
								<div class="piece-icon piece-icon-example-single">
									{#if coreSpiritExamples[0]}
										<img
											class="example-thumb example-tile example-tile-lg"
											src={coreSpiritExamples[0].image_url}
											alt={coreSpiritExamples[0].name}
											width="132"
											height="132"
											loading="lazy"
											decoding="async"
										/>
									{/if}
								</div>
							{:else}
								<div class="piece-icon">⬡</div>
							{/if}
							<h4>Hex Spirits</h4>
							<p>
								Hex tiles you summon onto available hex spaces on your Spirit Tableau. Their "stats" are
								just icons representing Origins and Classes.
							</p>
						</div>
						<div class="piece-card">
							<div class="piece-icon">⬢</div>
							<h4>Spirit Bags</h4>
							<p>
								Spirits come from either the <strong>Spirit World Bag</strong> or <strong>Arcane Abyss Bag</strong>.
								Any spirits you look at but don't choose to summon return to the <strong>same bag</strong>.
							</p>
						</div>
						<div class="piece-card">
							{#if tts}
								<div class="piece-icon piece-icon-examples">
									{#each coreRuneExamples as rune (rune.id)}
										{#if rune.icon_url}
											<img
												class="example-thumb example-icon"
												src={rune.icon_url}
												alt={rune.name}
												width="60"
												height="60"
												loading="lazy"
												decoding="async"
											/>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="piece-icon">◆</div>
							{/if}
							<h4>Runes</h4>
							<p>Crafting resources used for artifacts and for awakening/augmenting spirits.</p>
						</div>
						<div class="piece-card">
							{#if tts}
								<div class="piece-icon piece-icon-examples augment-examples">
									{#each coreAugmentExamples as rune (rune.id)}
										{#if rune.icon_url}
											<img
												class="example-thumb example-icon"
												src={rune.icon_url}
												alt={rune.class_name ?? rune.name}
												title={rune.class_name ?? rune.name}
												width="60"
												height="60"
												loading="lazy"
												decoding="async"
											/>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="piece-icon">✦</div>
							{/if}
							<h4>Spirit Augments</h4>
							<p>
								Tokens you place on spirits to permanently give them another Class trait.
							</p>
						</div>
						<div class="piece-card">
							{#if tts && artifactExamples[0]?.image_path}
								<div class="piece-icon piece-icon-example-single">
									<img
										class="example-thumb example-card example-card-lg"
										src={artifactExamples[0].image_path}
										alt="Arc Spirits artifact card"
										width="144"
										height="192"
										loading="lazy"
										decoding="async"
									/>
								</div>
							{:else}
								<div class="piece-icon">⬟</div>
							{/if}
							<h4>Artifacts</h4>
							<p>
								Guardian-exclusive upgrades and one-time benefits that you can spend runes on to activate.
							</p>
						</div>
						<div class="piece-card">
							{#if tts}
								<div class="piece-icon piece-icon-examples">
									{#each coreStatusTileExamples as icon (icon.id)}
										{#if icon.image_url}
											<img
												class="example-thumb example-icon example-status-tile"
												src={icon.image_url}
												alt={icon.name}
												width="96"
												height="96"
												loading="lazy"
												decoding="async"
											/>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="piece-icon">☠</div>
								{/if}
								<h4>Corruption Status (Status Tiles)</h4>
								<p>
									Your Corruption track: <strong>Pure → Tainted → Corrupt → Fallen</strong>.
								</p>
								<ul class="rule-list">
									<li>Some statuses (like <strong>Corrupt</strong> and <span class="status-badge fallen">Fallen</span>) grant <strong>Arcane Attack Dice</strong> in <strong>every combat</strong>.</li>
								</ul>
							</div>
							<div class="piece-card">
								{#if tts}
									<div class="piece-icon piece-icon-examples">
									{#each coreResourceExamples as icon (icon.id)}
										{#if icon.image_url}
											<img
												class="example-thumb example-icon"
												src={icon.image_url}
												alt={icon.name}
												width="60"
												height="60"
												loading="lazy"
												decoding="async"
											/>
										{/if}
									{/each}
								</div>
								{:else}
									<div class="piece-icon">📊</div>
								{/if}
								<h4>Resources</h4>
								<p>Track Victory Points, Barriers (HP), Arcane Blood, and Arcane Barriers.</p>
								<ul class="rule-list">
									<li><strong>Barrier:</strong> your HP. If you have <strong>0 Barriers</strong>, you cannot be a combatant.</li>
									<li>
										<strong>Arcane Blood:</strong> spend to drop <strong>Corruption Status</strong> by 1 and gain the <strong>one-time</strong> arrow reward
										(cost depends on your current Status).
									</li>
									<li><strong>Arcane Barrier:</strong> a <strong>one-time Barrier</strong> you can gain from Status drop rewards and some Spirit World reward rows.</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Spirit World -->
		<section id="spirit-world" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Spirit World</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				{#if spiritWorldBoard?.image_url}
					<div class="spirit-world-layout">
						<div class="spirit-world-copy">
							<p class="tree-intro">
								The Spirit World is the map that you, a Guardian, will be moving on.
							</p>
							<p>
								All players will be navigating to locations on the map, such as going from the Astral Zone to the
								Arcane. In general, choosing a location and doing the actions associated with that location
								is the primary decisionmaking in this game.
							</p>
							<p>
								Monsters are placed on Spirit World locations (as indicated on the monster card). While a monster
								occupies a location, it blocks you from resolving that location's Reward Rows.
							</p>
							<p>
								In general for all locations (except the Arcane Abyss), locations have Reward Rows. Each row is
								either a <strong>Gain</strong> row (no arrow) or a <strong>Trade</strong> row (arrow).
							</p>
							<ul class="rule-list">
								<li><strong>Gain</strong> rows mean you gain the benefit once.</li>
								<li><strong>Trade</strong> rows mean you can spend resources once to gain something else.</li>
								<li>Each row can be resolved <strong>once per player per round</strong>.</li>
							</ul>
						</div>
						<img
							class="board-img"
							src={spiritWorldBoard.image_url}
							alt="Spirit World board"
							loading="lazy"
							decoding="async"
						/>
					</div>
				{:else}
					<p class="tree-intro">Spirit World board image is not available right now (export not loaded).</p>
				{/if}
			</div>
		</section>

		<!-- Game Setup -->
		<section id="game-setup" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Game Setup</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				<ol class="rule-list">
					<li>Choose a Guardian and take their player mat.</li>
					<li>Setup Spirit Bags: Spirit World spirits → Spirit World Bag; Arcane Abyss spirits → Arcane Abyss Bag.</li>
					<li>Prepare the Monster deck (sorted by stage).</li>
					<li>Set starting state: Corruption Status = Pure, Barriers = 4.</li>
					<li>Read/resolve the opening event to begin.</li>
				</ol>
			</div>
		</section>

		<!-- Game Flow -->
		<section id="game-flow" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Game Flow</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				<p class="tree-intro">
					Arc Spirits runs in repeating <strong>rounds</strong> inside 4 escalating <strong>stages</strong>. Throughout these stages, players will be defeating monsters, progressing through the events in that scenario, and the game ends when the last stage card is drawn. Whoever has the most <strong>Victory Points</strong> at the end of the game wins.
				</p>

				<!-- 1. Stage Start -->
				<div id="stage-start" class="subchapter">
					<div class="subchapter-header">
						<span class="subchapter-num">1.</span>
						<h3 class="subchapter-title">Stage Start</h3>
					</div>
					<div class="subchapter-content">
						<p>
							Draw Stage cards from the Stage Deck for that stage. There will be a clear stage divider card that separates each stage, so keep drawing until you hit the end. There are three types of cards in the Stage Deck: <strong>Event Cards</strong>, <strong>Monster Cards</strong>, <strong>Location Cards</strong>. Be sure to read all Event cards, as they will tell you how to place down Location Cards. Monster cards should be placed in the location where its Invade Location indicates.
						</p>
					</div>
				</div>

				<!-- 2. Round Loop -->
				<div id="round-loop" class="subchapter">
					<div class="subchapter-header">
						<span class="subchapter-num">2.</span>
						<h3 class="subchapter-title">Round Loop</h3>
					</div>
					<div class="subchapter-content">
						<p class="tree-intro">Each round, all players execute these phases simultaneously:</p>

						<ol class="rule-list phase-overview">
							<li><strong>2.1 Navigation Phase</strong> — Choose and reveal destinations</li>
							<li><strong>2.2 Encounter Phase</strong> — <span class="monster-specific">Before Combat monster effects trigger</span>
								<ul class="rule-sublist">
									<li><strong>2.2a Combat Phase</strong> — <span class="monster-specific">Fight the monster (if present)</span></li>
								</ul>
							</li>
							<li><strong>2.3 Location Benefits Phase</strong> — Resolve Gain/Trade rows (Summoning, Cultivation, etc.)</li>
							<li><strong>2.4 Cleanup Phase</strong> — Check for stage progression, then repeat</li>
						</ol>

						<!-- 2.1 Navigation Phase -->
						<div id="realm-navigation" class="sub-subchapter">
							<div class="sub-subchapter-header">
								<span class="sub-subchapter-num">2.1</span>
								<h4 class="sub-subchapter-title">Navigation Phase</h4>
							</div>
							<p>Everyone secretly chooses a destination on the Spirit World, then all players reveal and move simultaneously.</p>
							<ul class="rule-list">
								<li><strong>TTS:</strong> Use the navigation buttons on the UI to select your destination.</li>
								<li><strong>Physical:</strong> Each player has a set of location cards—play one face-down, then reveal together.</li>
							</ul>
						</div>

						<!-- 2.2 Encounter Phase -->
						<div id="encounter-phase" class="sub-subchapter">
							<div class="sub-subchapter-header">
								<span class="sub-subchapter-num">2.2</span>
								<h4 class="sub-subchapter-title">Encounter Phase</h4>
							</div>
							<p>When you arrive at a location with a monster, <strong>Before Combat</strong> effects belonging to the monster may trigger before actual combat begins.</p>
							<ul class="rule-list monster-specific">
								<li><strong>Ambusher</strong> — Players lose Barriers before combat.</li>
								<li><strong>Arcane Hysteria</strong> — Induces PvP combat among players at the location.</li>
								<li>Other monster-specific triggers as indicated on the monster card.</li>
							</ul>

							<div class="nested-content">
								<!-- 2.2a Combat Phase -->
								<h5 id="monster-combat" class="flow-subheader"><span class="flow-num">2.2a</span> Combat Phase</h5>
								<p class="flow-intro">If players are at a location with a Monster, that Monster initiates combat with all players. See the <button class="link-button" onclick={() => scrollToSection('combat')}>Combat chapter</button> for full combat rules.</p>

								<p>At a high level, players roll dice and deal damage to the monster, and will Take Damage from the monster in return.</p>

								<p><strong>Damage/Barrier Reward Meter:</strong> On every monster card, there is a reward meter with a starting marker token. For every damage dealt to the monster, the token moves along the meter—all players gain those rewards individually.</p>
							</div>
						</div>

						<!-- 2.3 Location Benefits Phase -->
						<div id="reward-rows" class="sub-subchapter">
							<div class="sub-subchapter-header">
								<span class="sub-subchapter-num">2.3</span>
								<h4 class="sub-subchapter-title">Location Benefits Phase</h4>
							</div>
							<p class="flow-intro">
								If there is no monster present (anymore), and once all players have finished getting the benefits from the monsters (if any), players may now resolve reward rows on that location.
							</p>

							<ul class="rule-list">
								<li><strong>Gain rows</strong> (no arrow) — Take the listed resources for free.</li>
								<li><strong>Trade rows</strong> (with arrow) — Pay the cost to gain what's pictured.</li>
								<li>Each player resolves location reward rows <strong>independently</strong> (no blocking); each row is <strong>once per player per round</strong>.</li>
							</ul>
						</div>

						<!-- 2.4 Cleanup Phase -->
						<div id="end-of-round" class="sub-subchapter">
							<div class="sub-subchapter-header">
								<span class="sub-subchapter-num">2.4</span>
								<h4 class="sub-subchapter-title">Cleanup Phase</h4>
							</div>
							<p>Check if the Stage Card's Completion requirement has been hit yet. If so, advance to the next stage and draw all stage cards related to it.</p>
						</div>
					</div>
				</div>

			</div>
		</section>

		<!-- Initiating Combat -->
		<section id="combat" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Initiating Combat</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				<!-- Overview -->
				<div id="combat-overview" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Overview</h3>
					</div>
					<div class="subchapter-content">
						<p class="tree-intro">
							In general, combat occurs between two sides. Sides can be a group of players, 1 player, or 1 monster. Combat works the same throughout all of these scenarios, under the framework explained below.
						</p>

						<p>Combat consists of communicating damage coming from both sides, and then both sides Take Damage.</p>
					</div>
				</div>

				<!-- Step 1: Determine Combatants -->
				<div id="combatants-phase" class="subchapter">
					<div class="subchapter-header">
						<span class="subchapter-num">Step 1:</span>
						<h3 class="subchapter-title">Determine Combatants</h3>
					</div>
					<div class="subchapter-content">
						<ul class="rule-list">
							<li>Players at the location with <strong>at least 1 Barrier</strong> become combatants. No combatants = no combat.</li>
						</ul>
					</div>
				</div>

				<!-- Step 2: Preparation -->
				<div id="preparation-phase" class="subchapter">
					<div class="subchapter-header">
						<span class="subchapter-num">Step 2:</span>
						<h3 class="subchapter-title">Preparation</h3>
					</div>
					<div class="subchapter-content">
						<ol class="rule-list">
							<li>
								<strong>Consume Arcane Blood</strong> (Optional)
								<ul class="rule-sublist">
									<li>Spend/Consume the necessary amount of <strong>Arcane Blood</strong> (indicated on your current Status) to corrupt yourself, gaining the rewards indicated by the arrow and permanently lowering your Status.</li>
									<li>Arrow rewards are <strong>one-time</strong> (e.g., Arcane Attack Dice for this combat, Arcane Barriers).</li>
									<li>If your new Status reduces your Spirit limit, <strong>discard spirits</strong> immediately to the new limit.</li>
									<li>You can lower your Status multiple times before one combat.</li>
									<li><em>Example:</em> <span class="status-badge pure">Pure</span> → consumes blood → gains <strong>2 Arcane Attack Dice</strong> for this combat.</li>
								</ul>
							</li>
							<li>
								<strong>Guardian Artifact / Other Special Abilities</strong> (Optional)
								<ul class="rule-sublist">
									<li>If applicable, you may have some artifacts which can power you up during this phase.</li>
								</ul>
							</li>
						</ol>
					</div>
				</div>

				<!-- Step 3: Battle -->
				<div id="battle-phase" class="subchapter">
					<div class="subchapter-header">
						<span class="subchapter-num">Step 3:</span>
						<h3 class="subchapter-title">Battle</h3>
					</div>
					<div class="subchapter-content">
						<p><strong>Gather Attack Dice:</strong></p>
						<ul class="rule-list">
							<li>Use the Class reference sheet to see what combat dice are given to you in combat.</li>
							<li>Some dice also come from <strong>Corruption Status</strong> (e.g., <strong>Corrupt</strong> and <span class="status-badge fallen">Fallen</span> grant <strong>Arcane Attack Dice</strong> in every combat).</li>
							<li><em>Tip:</em> Keep dice near your area—adjust between combats instead of re-gathering.</li>
						</ul>

						<p><strong>Resolve:</strong></p>
						<ol class="rule-list">
							<li><strong>Both sides roll dice</strong> — Each side rolls their attack dice simultaneously.</li>
							<li><strong>Pool damage</strong> — If multiple players are on one side, sum all their damage together.</li>
							<li><strong>Communicate damage</strong> — Each side announces their total damage to the opposition.</li>
							<li><strong>Take Damage</strong> — Each side takes damage from the opposition (see Taking Damage below).</li>
						</ol>

						<ul class="rule-list">
							<li><span class="monster-specific"><strong>Monster Special Effects:</strong></span> Effects such as <strong>Elusive</strong> (if total pooled damage is an even number, the monster doesn't take any damage) and other effects may trigger at this point.</li>
						</ul>
					</div>
				</div>

				<!-- Take Damage (Info) -->
				<div id="taking-damage" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Take Damage</h3>
					</div>
					<div class="subchapter-content">
						<p>When you Take Damage, you lose Barriers equal to the damage received—but it can be prevented or reduced through various interactions, artifacts, and class traits. Even if the enemy is defeated, both sides still Take Damage.</p>
						<p class="monster-specific"><strong>Monster damage tracking:</strong> Move the Monster Damage Taken marker 1 slot to the right per damage dealt.</p>
						<p>Some key examples of damage reduction:</p>
						<ul class="rule-list">
							<li><strong>Defenders:</strong> Use rolled Defense Dice to negate incoming damage (see Class reference).</li>
							<li><strong>Support:</strong> Damage may be reduced by the Support trait (see Class reference).</li>
							<li><strong>Artifacts:</strong> Some artifacts provide damage reduction or prevention abilities.</li>
						</ul>
					</div>
				</div>

				<!-- Step 4: Aftermath -->
				<div id="reward-phase" class="subchapter">
					<div class="subchapter-header">
						<span class="subchapter-num">Step 4:</span>
						<h3 class="subchapter-title">Aftermath</h3>
					</div>
					<div class="subchapter-content">
						<p>Nothing happens in this step for players.</p>
						<ul class="rule-list">
							<li><span class="monster-specific"><strong>Monster Special Effects:</strong></span> Effects such as <strong>Fight to Death</strong> and other effects may trigger at this point (e.g., initiating combat again if you are still alive).</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Player Mat Overview -->
		<section id="player-mat-overview" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Player Mat Overview</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				<div class="player-mat-layout">
					<div class="player-mat-copy">
						<p class="tree-intro">
							Your <strong>Guardian mat</strong> is your personal play area. You place summoned Hex Spirits here,
							track rune placement for awakening/crafting, and keep your board state readable.
						</p>
						<ul class="rule-list">
							<li><strong>Spirits:</strong> Summoned spirits live on your mat (your tableau).</li>
							<li><strong>Runes:</strong> 4 slots to the right of the Corruption Status and Spirit Tableau.</li>
							<li><strong>Artifacts:</strong> Crafted artifacts remain with you as persistent upgrades.</li>
						</ul>
					</div>

					{#if playerMatScreenshot}
						<div class="player-mat-media">
							<div class="screenshot-sheet">
								<a class="screenshot-link" href={playerMatScreenshot.file_url} target="_blank" rel="noreferrer">
									<img
										class="screenshot-img"
										src={playerMatScreenshot.image_url}
										alt={playerMatScreenshot.caption}
										loading="lazy"
										decoding="async"
									/>
								</a>
							</div>
							<div class="note-box">Tip: click the screenshot to open it full-size.</div>
						</div>
					{/if}
				</div>

				<!-- Spirits -->
				<div id="spirits" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Spirits</h3>
					</div>
					<div class="subchapter-content">
						<p>Hex Spirits are tiles you summon onto the Spirit Tableau on your player mat. Each spirit has icons representing its <strong>Origin</strong> and <strong>Class</strong> traits.</p>
						<ul class="rule-list">
							<li>Spirits come from either the <strong>Spirit World Bag</strong> or <strong>Arcane Abyss Bag</strong>.</li>
							<li>Your spirit limit depends on your <strong>Corruption Status</strong>—lower status means fewer spirits allowed.</li>
							<li>Spirits provide combat dice and other benefits based on their Class traits.</li>
						</ul>
					</div>
				</div>

				<!-- Runes -->
				<div id="runes" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Runes</h3>
					</div>
					<div class="subchapter-content">
						<p>Runes are crafting resources collected throughout the game. Each player mat has 4 rune slots to the right of the Corruption Status and Spirit Tableau.</p>
						<ul class="rule-list">
							<li>Runes are used to craft <strong>Artifacts</strong> and for awakening/augmenting spirits.</li>
							<li>Store collected runes in the slots on your player mat.</li>
						</ul>
					</div>
				</div>

				<!-- Artifacts -->
				<div id="artifacts" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Artifacts</h3>
					</div>
					<div class="subchapter-content">
						<div class="artifact-inline">
							<div class="artifact-copy">
								<p>
									Artifacts are <strong>persistent upgrades</strong> (many are Guardian-specific).
								</p>

								<h5>Crafting Generally Requires:</h5>
								<ul class="rule-list">
									<li>Gathering the rune ingredients shown on the artifact/recipe</li>
									<li>Paying any additional listed costs (if any)</li>
								</ul>

								<div class="note-box">
									Once crafted, the artifact remains with the player and its benefits are active.
								</div>
							</div>

							{#if tts && artifactExamples[0]?.image_path}
								<div class="artifact-media">
									<img
										class="artifact-img artifact-img-inline"
										src={artifactExamples[0].image_path}
										alt={`${artifactExamples[0].name} artifact card`}
										loading="lazy"
										decoding="async"
									/>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Corruption Status & Arcane Blood -->
				<div id="spirit-status" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Corruption Status & Arcane Blood</h3>
					</div>
					<div class="subchapter-content">
						<p>Corruption Status tracks Arcane Corruption:</p>

						<div class="status-progression">
							{#each statusLabels as label, i (label)}
								<div class={`status-step ${label.toLowerCase()}`}>
									{#if statusTrackTiles[i]?.image_url}
										<img
											class="status-token-img"
											src={statusTrackTiles[i].image_url}
											alt={label}
											width="252"
											height="252"
											loading="lazy"
											decoding="async"
										/>
									{/if}
									<span class="status-name">{label}</span>
								</div>
								{#if i < statusLabels.length - 1}
									<div class="status-arrow">→</div>
								{/if}
							{/each}
						</div>
						<p>
							<strong>When you spend Arcane Blood, you decrease your Corruption Status by 1 step and gain a one-time reward (indicated by the arrow).</strong>
						</p>
						<ul class="rule-list">
							<li>The Arcane Blood cost to drop a Status depends on your <strong>current Status</strong> (shown on your mat).</li>
							<li>If your new Status reduces your Spirit limit, immediately <strong>discard spirits</strong> until at your new limit.</li>
							<li>
								Some statuses (like <strong>Corrupt</strong> and <span class="status-badge fallen">Fallen</span>) grant
								<strong>Arcane Attack Dice</strong> in <strong>every combat</strong>.
							</li>
							<li>
								If you are already <span class="status-badge fallen">Fallen</span>, you cannot spend
								Arcane Blood further.
							</li>
						</ul>

						<div class="example-box">
							<span class="example-label">Example:</span> Dropping from
							<span class="status-badge pure">Pure</span> can grant
							<strong>2 Arcane Attack Dice</strong> for that combat.
						</div>
					</div>
				</div>

				<!-- Overflow -->
				<div id="overflow" class="subchapter">
					<div class="subchapter-header">
						<h3 class="subchapter-title">Overflow</h3>
					</div>
					<div class="subchapter-content">
						<p>Overflow content goes here.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Icon Reference -->
		<section id="icon-reference" class="chapter">
			<div class="chapter-header">
				<h2 class="chapter-title">Icon Reference</h2>
				<div class="chapter-line"></div>
			</div>

			<div class="chapter-content">
				{#if tts}
					<!-- Icon Guide -->
					<div class="subchapter">
						<div class="subchapter-header">
							<h3 class="subchapter-title">Icon Guide</h3>
						</div>
						<div class="subchapter-content">
							<p>
								Not every icon needs to be memorized. However, 3 are crucial to understanding the game:
								<strong>Summoning Spirits</strong> (onto your Spirit Tableau/Player Mat) and
								<strong>Cultivating Spirits</strong> (Gaining Runes).
							</p>

							{#each iconGuideGroups as groupBlock (groupBlock.group)}
								<h5>{groupBlock.group}</h5>
								<div class="pieces-grid icon-guide-grid">
									{#each groupBlock.icons as icon (icon.id)}
										<div class="piece-card icon-card">
											<div class="piece-icon">
												{#if icon.image_url}
													<img
														class="icon-img"
														src={icon.image_url}
														alt={icon.name}
														width="40"
														height="40"
														loading="lazy"
														decoding="async"
													/>
												{:else}
													❖
												{/if}
											</div>
											<h4>
												<span class="icon-position">#{icon.position}</span>
												{icon.name}
											</h4>
											{#if icon.description}
												<p>{icon.description}</p>
											{/if}
										</div>
									{/each}
								</div>
							{/each}

							<div class="note-box">Export version: <strong>{tts.exported_at}</strong></div>
						</div>
					</div>
				{/if}
			</div>
		</section>

				<!-- Footer -->
				<footer class="rules-footer">
					<div class="footer-ornament"></div>
					<p>Arc Spirits — Tabletop Simulator Edition</p>
					<a href="/" class="footer-link">← Return to New Player Intro</a>
				</footer>
			</div>

			<!-- Sidebar -->
			<aside class="faq-sidebar">
				<!-- Terminology Section -->
				<div class="sidebar-section">
					<div class="sidebar-header">
						<span class="sidebar-icon">📖</span>
						<span>Terminology</span>
					</div>
					{#each currentTerms as term, i (i)}
						<div class="term-item">
							<h4 class="term-name">{term.term}</h4>
							<p class="term-definition">{term.definition}</p>
						</div>
					{/each}
				</div>

				<!-- FAQ Section -->
				<div class="sidebar-section">
					<div class="sidebar-header">
						<span class="sidebar-icon">?</span>
						<span>FAQ</span>
					</div>
					{#each currentFaqs as faq, i (i)}
						<div class="faq-item">
							<h4 class="faq-question">{faq.question}</h4>
							<p class="faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</aside>
		</div>
	</main>
</div>
