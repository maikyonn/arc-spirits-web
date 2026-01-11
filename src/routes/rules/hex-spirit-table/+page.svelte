<script lang="ts">
	import type { PageData } from './$types';
	import type { Class, HexSpirit, Origin, TTSExportData } from '$lib/data/types';

	let { data } = $props<{ data: PageData }>();
	const tts = $derived(data.tts) as TTSExportData | null;
	let view = $state<'origins' | 'matrix'>('origins');

	function normalizeSpiritName(name: string): string {
		return name.trim().replaceAll(/\s+/g, ' ').toLowerCase();
	}

	function getUniqueSpiritsByName(spirits: HexSpirit[]): HexSpirit[] {
		const map = new Map<string, HexSpirit>();
		for (const spirit of spirits) {
			const key = normalizeSpiritName(spirit.name);
			if (!key) continue;
			if (!map.has(key)) map.set(key, spirit);
		}
		return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
	}

	const originsSorted = $derived.by(() =>
		(() => {
			if (!tts) return [] as Origin[];

			const uniqueSpirits = getUniqueSpiritsByName(tts.hex_spirits);
			const countsByOriginId = new Map<string, number>();
			for (const spirit of uniqueSpirits) {
				const originIds = new Set(spirit.traits.origins.map((o) => o.id));
				for (const originId of originIds) {
					countsByOriginId.set(originId, (countsByOriginId.get(originId) ?? 0) + 1);
				}
			}

			return [...tts.origins]
				.filter((o) => normalizeSpiritName(o.name) !== 'lost')
				.sort(
					(a, b) =>
						(countsByOriginId.get(b.id) ?? 0) - (countsByOriginId.get(a.id) ?? 0) ||
						a.name.localeCompare(b.name)
				);
		})()
	);

	const classesSorted = $derived.by(() =>
		tts ? [...tts.classes].sort((a, b) => a.name.localeCompare(b.name)) : ([] as Class[])
	);

	const uniqueSpirits = $derived.by(() => (tts ? getUniqueSpiritsByName(tts.hex_spirits) : ([] as HexSpirit[])));

	const spiritsByOrigin = $derived.by(() => {
		if (!tts) return new Map<string, HexSpirit[]>();

		const map = new Map<string, Map<string, HexSpirit>>();

		for (const spirit of uniqueSpirits) {
			const nameKey = normalizeSpiritName(spirit.name);
			if (!nameKey) continue;

			const originIds = new Set(spirit.traits.origins.map((o) => o.id));
			for (const originId of originIds) {
				const list = map.get(originId);
				if (list) list.set(nameKey, spirit);
				else map.set(originId, new Map([[nameKey, spirit]]));
			}
		}

		const result = new Map<string, HexSpirit[]>();
		for (const [originId, byName] of map) {
			result.set(
				originId,
				[...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
			);
		}

		return result;
	});

	const spiritsByOriginClass = $derived.by(() => {
		if (!tts) return new Map<string, HexSpirit[]>();

		const map = new Map<string, Map<string, HexSpirit>>();

		for (const spirit of uniqueSpirits) {
			const nameKey = normalizeSpiritName(spirit.name);
			if (!nameKey) continue;

			const originIds = new Set(spirit.traits.origins.map((o) => o.id));
			const classIds = new Set(spirit.traits.classes.map((c) => c.id));

			for (const originId of originIds) {
				for (const classId of classIds) {
					const key = `${originId}:${classId}`;
					const list = map.get(key);
					if (list) list.set(nameKey, spirit);
					else map.set(key, new Map([[nameKey, spirit]]));
				}
			}
		}

		const result = new Map<string, HexSpirit[]>();
		for (const [key, byName] of map) {
			result.set(
				key,
				[...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
			);
		}

		return result;
	});
</script>

<svelte:head>
	<title>Arc Spirits - Hex Spirit Table</title>
	<meta
		name="description"
		content="Hex spirit reference table grouped by Origin and Class for Arc Spirits tabletop game"
	/>
</svelte:head>

<div class="rules-page">
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
				<span class="section-icon">⬢</span>
				<h2>Hex Spirit Table</h2>
				<div class="section-line"></div>
			</div>

			{#if tts}
				<div class="content-block">
					<div class="hex-spirit-header-row">
						<p class="lead-text">
							Browse Hex Spirits by <strong>Origin</strong> (default) or view the <strong>Class × Origin</strong> matrix.
						</p>

						<div class="hex-spirit-view-toggle" role="tablist" aria-label="Hex spirit views">
							<button
								type="button"
								class:active={view === 'origins'}
								role="tab"
								aria-selected={view === 'origins'}
								onclick={() => (view = 'origins')}
							>
								By Origin
							</button>
							<button
								type="button"
								class:active={view === 'matrix'}
								role="tab"
								aria-selected={view === 'matrix'}
								onclick={() => (view = 'matrix')}
							>
								Matrix
							</button>
						</div>
					</div>

					{#if view === 'origins'}
						<div class="hex-spirit-origin-list">
							{#each originsSorted as origin (origin.id)}
								{@const spirits = spiritsByOrigin.get(origin.id) ?? []}
								<section class="hex-spirit-origin-card">
									<header class="hex-spirit-origin-header">
										<div class="hex-spirit-origin-title">
											{#if origin.icon_url}
												<img
													class="mini-icon"
													src={origin.icon_url}
													alt={origin.name}
													title={origin.name}
													width="22"
													height="22"
													loading="lazy"
													decoding="async"
												/>
											{/if}
											<h3 class="hex-spirit-origin-name">{origin.name}</h3>
											<span class="hex-spirit-origin-count">{spirits.length}</span>
										</div>
									</header>

									<div class="hex-spirit-origin-grid" aria-label={`${origin.name} spirits`}>
										{#each spirits as spirit (spirit.id)}
											<img
												class="hex-spirit-thumb"
												src={spirit.image_url}
												alt={spirit.name}
												title={spirit.name}
												width="208"
												height="208"
												loading="lazy"
												decoding="async"
											/>
										{/each}
									</div>
								</section>
							{/each}
						</div>
					{:else}
						<div class="hex-spirit-table-wrapper">
							<table class="hex-spirit-table">
								<thead>
									<tr>
										<th class="hex-spirit-corner" aria-hidden="true"></th>
										{#each originsSorted as origin (origin.id)}
											<th class="hex-spirit-col-header">
												{#if origin.icon_url}
													<img
														class="mini-icon"
														src={origin.icon_url}
														alt={origin.name}
														title={origin.name}
														width="22"
														height="22"
														loading="lazy"
														decoding="async"
													/>
												{:else}
													<span class="hex-spirit-header-fallback" title={origin.name}>{origin.name}</span>
												{/if}
											</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each classesSorted as cls (cls.id)}
										<tr>
											<th class="hex-spirit-row-header">
												{#if cls.icon_url}
													<img
														class="mini-icon"
														src={cls.icon_url}
														alt={cls.name}
														title={cls.name}
														width="22"
														height="22"
														loading="lazy"
														decoding="async"
													/>
												{:else}
													<span class="hex-spirit-header-fallback" title={cls.name}>{cls.name}</span>
												{/if}
											</th>

											{#each originsSorted as origin (origin.id)}
												{@const key = `${origin.id}:${cls.id}`}
												{@const spirits = spiritsByOriginClass.get(key) ?? []}
												<td class="hex-spirit-cell">
													<div class="hex-spirit-cell-grid">
														{#each spirits as spirit (spirit.id)}
															<img
																class="hex-spirit-thumb"
																src={spirit.image_url}
																alt={spirit.name}
																title={spirit.name}
																width="208"
																height="208"
																loading="lazy"
																decoding="async"
															/>
														{/each}
													</div>
												</td>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}

					<div class="note-box">Export version: <strong>{tts.exported_at}</strong></div>
				</div>
			{:else}
				<div class="content-block">
					<p class="lead-text">Hex Spirit Table is not available right now (export not loaded).</p>
				</div>
			{/if}
		</section>
	</main>
</div>
