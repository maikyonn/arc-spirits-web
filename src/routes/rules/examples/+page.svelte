<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { Monster, RewardIcon, SpecialEffect, TTSExportData } from '$lib/data/types';

	let { data } = $props<{ data: PageData }>();
	const tts = $derived(data.tts) as TTSExportData | null;
	let showWip = $state(true);

	onMount(() => {
		showWip = true;
	});

	type IconCount = { icon: RewardIcon; count: number };
	function groupRewardIcons(icons: RewardIcon[]): IconCount[] {
		const map = new Map<string, IconCount>();
		for (const icon of icons) {
			const key = icon.id || icon.name;
			const existing = map.get(key);
			if (existing) existing.count += 1;
			else map.set(key, { icon, count: 1 });
		}
		return [...map.values()];
	}

	function buildEffectsById(effects: SpecialEffect[]) {
		return new Map(effects.map((e) => [e.id, e]));
	}

	const effectsById = $derived.by(() =>
		tts ? buildEffectsById(tts.special_effects) : new Map<string, SpecialEffect>()
	);

	const monsterExamples = $derived.by(() => {
		if (!tts) return [] as Monster[];
		const monstersWithImages = tts.monsters.filter((m) => m.type === 'monster' && m.image_url);
		return monstersWithImages.slice(0, 12);
	});
</script>

<svelte:head>
	<title>Arc Spirits - Examples</title>
	<meta name="description" content="Arc Spirits examples" />
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
				<span class="section-icon">✶</span>
				<h2>Examples</h2>
				<div class="section-line"></div>
			</div>

			{#if tts}
				<div class="content-block">
					<h3>Monster Examples</h3>
					<div class="pieces-grid monsters-grid">
						{#each monsterExamples as monster (`${monster.id}:${monster.copy_index}`)}
							<div class="piece-card monster-card">
								{#if monster.image_url}
									<img
										class="monster-img"
										src={monster.image_url}
										alt={`${monster.name} monster card`}
										loading="lazy"
										decoding="async"
									/>
								{/if}

								<h4 class="monster-title">{monster.name}</h4>
								<div class="monster-stats">
									{#if monster.barrier !== null}<span class="stat-pill">Barrier: {monster.barrier}</span>{/if}
									{#if monster.damage !== null}<span class="stat-pill">Damage: {monster.damage}</span>{/if}
								</div>

								{#if monster.effect_ids.length > 0}
									<div class="monster-effects">
										{#each monster.effect_ids as effectId (effectId)}
											{@const effect = effectsById.get(effectId)}
											{#if effect}
												<span class="effect-pill" style={`--effect:${effect.color ?? 'var(--gold-dim)'}`}>
													{effect.name}
												</span>
											{/if}
										{/each}
									</div>
								{/if}

								{#if monster.reward_rows.length > 0}
									<div class="monster-rewards">
										{#each monster.reward_rows as row, idx (idx)}
											<div class="reward-row compact">
												<span class="reward-tag monster">{row.label ?? row.type}</span>
												<div class="reward-icons">
													{#each groupRewardIcons(row.icons) as entry (entry.icon.id)}
														<span class="reward-icon">
															{#if entry.icon.image_url}
																<img
																	class="mini-icon"
																	src={entry.icon.image_url}
																	alt={entry.icon.name}
																	width="22"
																	height="22"
																	loading="lazy"
																	decoding="async"
																/>
															{/if}
															{#if entry.count > 1}<span class="icon-count">×{entry.count}</span>{/if}
														</span>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="content-block">
					<p class="lead-text">Examples are not available right now (export not loaded).</p>
				</div>
			{/if}
		</section>
	</main>
</div>
