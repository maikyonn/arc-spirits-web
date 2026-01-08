<script lang="ts">
	import './page.css';

	import { onMount, tick } from 'svelte';
	import { fetchTTSData, getRandomSpirits, getStats } from '$lib/data/store';
	import type { HexSpirit, Guardian } from '$lib/data/types';
	import {
		setupHomeGsapAnimations,
		setupMatSpiritsAnimation,
		startFloatingSpirits
	} from '$lib/animations/home';

	import ActionsSection from '$lib/components/home/ActionsSection.svelte';
	import AtAGlanceSection from '$lib/components/home/AtAGlanceSection.svelte';
	import CombatSection from '$lib/components/home/CombatSection.svelte';
	import Footer from '$lib/components/home/Footer.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import IntroSection from '$lib/components/home/IntroSection.svelte';
	import LoopSection from '$lib/components/home/LoopSection.svelte';
	import NavBar from '$lib/components/home/NavBar.svelte';
	import NextStepsSection from '$lib/components/home/NextStepsSection.svelte';
	import PiecesSection from '$lib/components/home/PiecesSection.svelte';
	import PlayerMatShowcase from '$lib/components/home/PlayerMatShowcase.svelte';
	import QuickstartBanner from '$lib/components/home/QuickstartBanner.svelte';
	import TtsSection from '$lib/components/home/TtsSection.svelte';
	import UiMapSection from '$lib/components/home/UiMapSection.svelte';

	let activeSection = $state('glance');
	let heroSpirits = $state<HexSpirit[]>([]);
	let matSpirits = $state<HexSpirit[]>([]);
	let playerMat = $state<{ guardian: Guardian; mat_url: string } | null>(null);
	let stats = $state<ReturnType<typeof getStats> | null>(null);

	const sections = [
		{ id: 'glance', label: 'At a Glance', icon: '60s' },
		{ id: 'loop', label: 'The Loop', icon: '1' },
		{ id: 'pieces', label: 'The Pieces', icon: '2' },
		{ id: 'tts', label: 'Playing in TTS', icon: '3' },
		{ id: 'actions', label: 'Common Actions', icon: '4' },
		{ id: 'combat', label: 'Combat', icon: '5' },
		{ id: 'ui', label: 'UI Map', icon: '6' }
	];

	function scrollToSection(id: string) {
		activeSection = id;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	onMount(() => {
		const ctx = setupHomeGsapAnimations();

		(async () => {
			try {
				const data = await fetchTTSData();
				heroSpirits = getRandomSpirits(data, 20);
				matSpirits = getRandomSpirits(data, 7);
				stats = getStats(data);

				if (data.guardians?.length) {
					const guardiansWithMats = data.guardians.filter((g) => g.mat_image_url);
					if (guardiansWithMats.length > 0) {
						const randomGuardian =
							guardiansWithMats[Math.floor(Math.random() * guardiansWithMats.length)];
						playerMat = {
							guardian: randomGuardian,
							mat_url: randomGuardian.mat_image_url!
						};
					}
				}

				await tick();
				ctx.add(() => {
					startFloatingSpirits();
					setupMatSpiritsAnimation();
				});
			} catch (error) {
				console.error('Failed to load TTS data:', error);
			}
		})();

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Arc Spirits - New Player Intro</title>
	<meta
		name="description"
		content="Learn to play Arc Spirits, a simultaneous map-driven tableau-builder game"
	/>

	<!-- Open Graph / Discord Embed -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://arc-spirits-web.vercel.app/" />
	<meta property="og:title" content="Arc Spirits - New Player Intro" />
	<meta
		property="og:description"
		content="A simultaneous, map-driven tableau-builder where you program destinations, resolve fights, and grow your spirit engine. Play on Tabletop Simulator!"
	/>
	<meta property="og:image" content="https://arc-spirits-web.vercel.app/embed-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Arc Spirits - New Player Intro" />
	<meta
		name="twitter:description"
		content="A simultaneous, map-driven tableau-builder where you program destinations, resolve fights, and grow your spirit engine."
	/>
	<meta name="twitter:image" content="https://arc-spirits-web.vercel.app/embed-image.png" />

	<!-- Theme Color (shows as accent on Discord) -->
	<meta name="theme-color" content="#c4a060" />
</svelte:head>

<div class="app-container">
	<!-- Diagonal stripe overlay -->
	<div class="diagonal-overlay"></div>

	<!-- Slashed accent lines -->
	<div class="slash-accents">
		<div class="slash slash-1"></div>
		<div class="slash slash-2"></div>
		<div class="slash slash-3"></div>
	</div>
	<NavBar {sections} {activeSection} onNavigate={scrollToSection} />
	<HeroSection {heroSpirits} onNavigate={scrollToSection} />
	<QuickstartBanner onNavigate={scrollToSection} />

	<main class="main-content">
		<PlayerMatShowcase {playerMat} {matSpirits} />
		<IntroSection />
		<AtAGlanceSection />
		<LoopSection />
		<PiecesSection />
		<TtsSection />
		<ActionsSection />
		<CombatSection />
		<UiMapSection />
		<NextStepsSection />
	</main>

	<Footer {stats} />
</div>
