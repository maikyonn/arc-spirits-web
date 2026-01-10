<script lang="ts">
	import { onMount } from 'svelte';
	import GameFlowDiagram from '$lib/components/rules/GameFlowDiagram.svelte';
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

	type TocItem = {
		id?: string;
		label: string;
		href?: string;
		children?: TocItem[];
	};
	const toc: TocItem[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'spirit-world', label: 'Spirit World' },
		{ id: 'game-flow', label: 'Game Flow' },
		{ id: 'combat', label: 'Combat Interaction' },
		{ id: 'location-benefits', label: 'Location Benefits' },
		{
			id: 'player-mat-overview',
			label: 'Player Mat Overview',
			children: [
				{ id: 'artifacts', label: 'Artifacts' },
				{ id: 'spirit-status', label: 'Spirit Status' }
			]
		},
		{ id: 'icon-reference', label: 'Icon Reference' },
		{ label: 'Examples', href: '/rules/examples' },
		{ label: 'TTS Guide', href: '/rules/tts-guide' }
	];

	function flattenTocIds(items: TocItem[]): string[] {
		const result: string[] = [];
		for (const item of items) {
			if (item.id) result.push(item.id);
			if (item.children) result.push(...flattenTocIds(item.children));
		}
		return result;
	}

	function scrollToSection(id: string) {
		activeSection = id;
		tocOpen = false;
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -100;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
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
							<button class="toc-link" class:active={activeSection === item.id} onclick={() => item.id && scrollToSection(item.id)}>
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
												class:active={activeSection === child.id}
												onclick={() => child.id && scrollToSection(child.id)}
											>
												{child.label}
											</button>
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
		<!-- Overview Section -->
		<section id="overview" class="rule-section">
			<div class="section-header">
				<span class="section-icon">◈</span>
				<h2>Overview</h2>
				<div class="section-line"></div>
			</div>

			<div class="content-block intro-block">
				<p class="lead-text">
					Arc Spirits is a competitive board game for <strong>1–6 players</strong>, played over four
					escalating stages. The game is <em>parallel / simultaneous</em>: each round, all players
					choose in secret, then resolve together (not sequential turns).
				</p>
				<p class="lead-text">
					Throughout the four stages of the game you gather spirits to build compositions that generate
					<strong>combat power</strong> and <strong>resources</strong>. Your goal is to defeat monsters,
					score <strong>Victory Points</strong>, and finish with the most VP when the final boss falls.
				</p>
			</div>

			<div class="callout-box win-condition">
				<div class="callout-icon">🏆</div>
				<div class="callout-content">
					<h4>Win Condition</h4>
					<p>The game ends when the <strong>final stage boss</strong> is defeated.</p>
					<p>Highest <strong>Victory Points (VP)</strong> wins.</p>
				</div>
			</div>

				<div class="content-block">
					<h3>Core Pieces</h3>
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
							<h4>Status Tiles</h4>
							<p>
								Tiles that represent your Corruption Status (Pure → Tainted → Corrupt → Fallen).
							</p>
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
							<p>Track Victory Points, Barriers (HP), and Arcane Blood.</p>
						</div>
					</div>
				</div>

		</section>

		<!-- Spirit World -->
		<section id="spirit-world" class="rule-section">
			<div class="section-header">
				<span class="section-icon">✦</span>
				<h2>Spirit World</h2>
				<div class="section-line"></div>
			</div>

			{#if spiritWorldBoard?.image_url}
				<div class="content-block">
					<div class="spirit-world-layout">
						<div class="spirit-world-copy">
							<p class="lead-text">
								The Spirit World is the map that you, a Guardian, will be moving on.
							</p>
							<p>
								All players will be navigating to locations on the map, such as going from the Astral Zone to the
								Arcane. In general, choosing a location and doing the actions associated with that location
								is the primary decisionmaking in this game.
							</p>
							<p>
								Monster cards may also be placed on Spirit World locations, which will block you from activating
								the Reward Rows on that location.
							</p>
							<p>
								In general for all locations (except the Arcane Abyss), locations will have two types of
								reward rows: <strong>Gain</strong> rows and <strong>Trade</strong> rows.
							</p>
							<ul class="rule-list">
								<li><strong>Gain</strong> rows mean you gain the benefit once.</li>
								<li><strong>Trade</strong> rows mean you can spend resources to gain something else once.</li>
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
				</div>
			{:else}
				<div class="content-block">
					<p class="lead-text">Spirit World board image is not available right now (export not loaded).</p>
				</div>
			{/if}
		</section>

		<!-- Game Flow Section -->
		<section id="game-flow" class="rule-section">
			<div class="section-header">
				<span class="section-icon">↻</span>
				<h2>Game Flow</h2>
				<div class="section-line"></div>
			</div>

			<div class="content-block">
				<p class="lead-text">
					Click on each section of the diagram below for detailed information about setup, stages, rounds, and game end.
				</p>
			</div>

			<div class="diagram-container full-width">
				<GameFlowDiagram />
			</div>
		</section>

		<!-- Combat Interaction Section -->
		<section id="combat" class="rule-section">
			<div class="section-header">
				<span class="section-icon">⚔</span>
				<h2>Combat Interaction</h2>
				<div class="section-line"></div>
			</div>

			<div class="combat-sequence">
				<p class="combat-intro">
					If a monster occupies the location, resolve combat in sequence. Monsters will typically have special
					effects that can be necessary to understand.
				</p>

				<div class="combat-timeline">
					<!-- Step 1 -->
					<div class="combat-phase" data-step="1">
						<div class="phase-marker">
							<span class="marker-num">1</span>
							<div class="marker-line"></div>
						</div>
						<div class="phase-card">
							<div class="card-header">
								<span class="phase-icon">◇</span>
								<h5>Determine Combatants</h5>
							</div>
							<div class="card-body">
								<ul>
									<li>Players at the location with <strong>at least 1 Barrier</strong> become combatants</li>
									<li>Players with <strong>0 Barriers</strong> cannot engage</li>
									<li>If there are no combatants, combat does not start and you do not advance to the next combat step</li>
								</ul>
							</div>
						</div>
					</div>

					<!-- Step 2 -->
					<div class="combat-phase" data-step="2">
						<div class="phase-marker">
							<span class="marker-num">2</span>
							<div class="marker-line"></div>
						</div>
						<div class="phase-card optional">
							<div class="card-header">
								<span class="phase-icon">◈</span>
								<h5>Consume Arcane Blood</h5>
								<span class="optional-tag">Optional</span>
							</div>
							<div class="card-body">
								<ul>
									<li>
										If you want to, you can Spend/Consume (the necessary amount indicated on your current
										Status) <strong>Arcane Blood</strong> to corrupt yourself, gaining the rewards
										indicated by the arrow, and permanently lowering your Status.
									</li>
									<li>If your new Status reduces your Spirit limit, <strong>discard spirits</strong> immediately to the new limit</li>
									<li>You can lower your Status multiple times before one combat</li>
								</ul>
								<div class="inline-example">
									<span class="status-badge pure">Pure</span> → consumes blood → gains <strong>2 Arcane Attack Dice</strong> for this combat only
								</div>
							</div>
						</div>
					</div>

					<!-- Step 3 -->
					<div class="combat-phase" data-step="3">
						<div class="phase-marker">
							<span class="marker-num">3</span>
							<div class="marker-line"></div>
						</div>
						<div class="phase-card">
							<div class="card-header">
								<span class="phase-icon">⬡</span>
								<h5>Gather Attack Dice</h5>
							</div>
							<div class="card-body">
								<ul>
									<li>Use the Class reference sheet to see what combat dice are given to you in combat</li>
									<li>The primary way of getting combat dice is through the <strong>Fighter</strong> class</li>
									<li>See Traits: Classes & Origins chapter (will write later)</li>
								</ul>
								<div class="inline-tip">
									Keep dice near your area — adjust between combats instead of re-gathering
								</div>
							</div>
						</div>
					</div>

					<!-- Step 4 -->
					<div class="combat-phase" data-step="4">
						<div class="phase-marker">
							<span class="marker-num">4</span>
							<div class="marker-line"></div>
						</div>
						<div class="phase-card highlight">
							<div class="card-header">
								<span class="phase-icon">⚔</span>
								<h5>Resolve the Fight</h5>
								<span class="coop-tag">Cooperative</span>
							</div>
							<div class="card-body">
								<p class="combat-substep-intro">All combatants fighting the monster roll their dice and pool their damage:</p>
								<ul>
									<li><strong>Deal damage:</strong> Move the Monster Damage Taken marker 1 slot to the right per damage dealt</li>
									<li><strong>Defend against counterattack:</strong> Each combatant checks if they defended the monster's attack</li>
								</ul>
								<ol class="defense-steps">
									<li>Each combatant checks whether they defended the monster's attack</li>
									<li>Combatants with <strong>no defenders</strong> take all incoming damage</li>
									<li>
										Combatants with <strong>defenders</strong> may use rolled Defense Dice to negate incoming damage
										<em>(see Class reference)</em>
									</li>
									<li>
										Damage taken may be reduced by the <strong>Support</strong> trait <em>(see Class reference)</em>.
									</li>
								</ol>
								<p><strong>Damage taken means you lose Barriers.</strong></p>
							</div>
						</div>
					</div>

					<!-- Step 5 -->
					<div class="combat-phase" data-step="5">
						<div class="phase-marker final">
							<span class="marker-num">5</span>
						</div>
						<div class="phase-card reward">
							<div class="card-header">
								<span class="phase-icon">✦</span>
								<h5>Claim Rewards</h5>
							</div>
							<div class="card-body">
								<ul>
									<li>
										All combatants receive rewards based on how the Monster Damage marker moved. All combatants get
										the same rewards, and there may be an additional participation reward as well.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

					<div class="combat-footer">
						<div class="footer-note">
							<span class="note-icon">※</span>
							Special combat rules on monster cards take precedence. Boss fights in the <strong>Arcane Abyss</strong> follow this same structure.
						</div>
					</div>
				</div>

			</section>

			<!-- Location Benefits Section -->
			<section id="location-benefits" class="rule-section">
			<div class="section-header">
				<span class="section-icon">◎</span>
				<h2>Location Benefits</h2>
				<div class="section-line"></div>
			</div>

				<div class="content-block">
					<p class="lead-text">After the monster has been defeated (or immediately if no monster is present), resolve location rewards:</p>

				<div class="reward-types">
					<div class="reward-type gain">
						<div class="reward-label">GAIN</div>
						<p>Take the listed resources <strong>for free</strong>.</p>
						<p class="reward-indicator">Indicated by rows <strong>without</strong> an arrow</p>
					</div>
					<div class="reward-type trade">
						<div class="reward-label">TRADE</div>
						<p>Pay the listed cost to gain what's pictured.</p>
						<p class="reward-indicator">Indicated by rows <strong>with</strong> an arrow</p>
					</div>
				</div>

					<ul class="rule-list">
						<li>Each player resolves rewards <strong>independently</strong> (no competition/blocking).</li>
						<li>Players may choose to do <strong>one, all, or none</strong> of the reward rows at that location.</li>
					</ul>
				</div>

			</section>

			<!-- Player Mat Overview Section -->
			<section id="player-mat-overview" class="rule-section">
				<div class="section-header">
					<span class="section-icon">⬡</span>
					<h2>Player Mat Overview</h2>
					<div class="section-line"></div>
				</div>

				<div class="content-block">
					<div class="player-mat-layout">
						<div class="player-mat-copy">
							<p class="lead-text">
								Your <strong>Guardian mat</strong> is your personal play area. You place summoned Hex Spirits here,
								track rune placement for awakening/crafting, and keep your board state readable.
							</p>
							<ul class="rule-list">
								<li><strong>Spirits:</strong> Summoned spirits live on your mat (your tableau).</li>
								<li><strong>Runes:</strong> Place rune tokens on spirits to awaken or augment them.</li>
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
				</div>

				<!-- Artifacts -->
				<article id="artifacts" class="subsection">
					<div class="subsection-header">
						<span class="subsection-icon">⬟</span>
						<h4>Artifacts</h4>
					</div>

					<div class="subsection-content">
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
				</article>

				<!-- Spirit Status & Arcane Blood -->
				<article id="spirit-status" class="subsection">
					<div class="subsection-header">
						<span class="subsection-icon">◉</span>
						<h4>Spirit Status & Arcane Blood</h4>
					</div>

					<div class="subsection-content">
						<p>Spirit Status tracks Arcane Corruption:</p>

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
							<strong>When you spend Arcane Blood, you decrease your Spirit Status by 1 step.</strong>
						</p>
						<ul class="rule-list">
							<li>If your new Status reduces your Spirit limit, immediately <strong>discard spirits</strong> until at your new limit.</li>
							<li>
								You gain the combat bonus associated with that Status drop for the
								<strong>next combat only</strong>.
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
				</article>

			</section>

			<!-- Icon Reference Section -->
			<section id="icon-reference" class="rule-section">
				<div class="section-header">
					<span class="section-icon">❖</span>
				<h2>Icon Reference</h2>
				<div class="section-line"></div>
			</div>

				<div class="content-block">
					{#if tts}
						<article class="subsection">
							<div class="subsection-header">
								<span class="subsection-icon">❖</span>
								<h4>Icon Guide</h4>
							</div>

							<div class="subsection-content">
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
						</article>
					{/if}

			</div>
		</section>

		<!-- Footer -->
		<footer class="rules-footer">
			<div class="footer-ornament"></div>
			<p>Arc Spirits — Tabletop Simulator Edition</p>
			<a href="/" class="footer-link">← Return to New Player Intro</a>
		</footer>
	</main>
</div>
