<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { ScreenshotAsset, TTSExportData } from '$lib/data/types';

	let { data } = $props<{ data: PageData }>();
	const tts = $derived(data.tts) as TTSExportData | null;
	let showWip = $state(true);

	onMount(() => {
		showWip = true;
	});

	const ttsScreenshotCaptions: Record<string, string> = {
		'1_mod_load': 'Wait for the mod to load',
		'2_chara_select': 'Select a character',
		'3_player_mat': 'Player mat & UI'
	};

	type TtsScreenshot = ScreenshotAsset & { caption: string };
	const ttsScreenshots = $derived.by(() => {
		if (!tts) return [] as TtsScreenshot[];
		return [...(tts.screenshots ?? [])]
			.filter((s) => s.name !== '3_player_mat')
			.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
			.map((s) => ({
				...s,
				caption: ttsScreenshotCaptions[s.name] ?? s.name.replaceAll('_', ' ')
			}));
	});
</script>

<svelte:head>
	<title>Arc Spirits - TTS Guide</title>
	<meta name="description" content="Arc Spirits Tabletop Simulator guide" />
</svelte:head>

<div class="rules-page">
	{#if showWip}
		<div class="wip-overlay" role="dialog" aria-modal="true" aria-label="Work in progress">
			<div class="wip-modal">
				<h3 class="wip-title">Work in progress</h3>
				<p class="wip-text">
					This page is still being built. For now, use the main Rules page.
				</p>
				<div class="wip-actions">
					<a class="wip-button primary" href="/rules">Go to Rules</a>
					<a class="wip-button" href="/">Go to Intro</a>
					<button class="wip-button" type="button" onclick={() => (showWip = false)}>Continue anyway</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="bg-texture"></div>
	<div class="bg-gradient"></div>
	<div class="diagonal-lines">
		<div class="diag diag-1"></div>
		<div class="diag diag-2"></div>
		<div class="diag diag-3"></div>
	</div>

	<nav class="top-nav">
		<a href="/rules" class="back-link">
			<span class="back-icon">←</span>
			<span class="back-text">Back to Rules</span>
		</a>
		<a href="/" class="back-link">
			<span class="back-text">Back to Intro</span>
		</a>
	</nav>

	<main class="rules-main no-toc">
		<section class="rule-section">
			<div class="section-header">
				<span class="section-icon">📸</span>
				<h2>TTS Guide</h2>
				<div class="section-line"></div>
			</div>

			{#if ttsScreenshots.length > 0}
				<div class="content-block">
					<p class="lead-text">
						These screenshots are pulled directly from the mod export (same data source as the icon guide and
						mats).
					</p>

					<div class="pieces-grid screenshot-grid">
						{#each ttsScreenshots as shot (shot.name)}
							<div class="piece-card screenshot-card">
								<a class="screenshot-link" href={shot.file_url} target="_blank" rel="noreferrer">
									<img
										class="screenshot-img"
										src={shot.image_url}
										alt={shot.caption}
										loading="lazy"
										decoding="async"
									/>
								</a>
								<h4 class="screenshot-title">{shot.caption}</h4>
							</div>
						{/each}
					</div>

					<div class="note-box">Tip: click a screenshot to open it full-size.</div>
				</div>
			{:else}
				<div class="content-block">
					<p class="lead-text">Screenshots are not available right now (export not loaded).</p>
				</div>
			{/if}
		</section>
	</main>
</div>
