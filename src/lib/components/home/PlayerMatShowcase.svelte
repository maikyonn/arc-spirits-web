<script lang="ts">
	import type { Guardian, HexSpirit } from '$lib/data/types';
	import { defineHex, Grid, Orientation, rectangle, spiral } from 'honeycomb-grid';

	type PlayerMat = { guardian: Guardian; mat_url: string };

	let { playerMat, matSpirits } = $props<{
		playerMat: PlayerMat | null;
		matSpirits: HexSpirit[];
	}>();

	// Honeycomb position settings
	const OFFSET_X = 0;
	const OFFSET_Y = 4.5;
	const SCALE = 95;
	const HEX_WIDTH = 38;
	const CONTAINER_HEIGHT = 100;
	const HEX_GAP = 0.93;

	const Hex = defineHex({
		dimensions: { xRadius: 64, yRadius: 63.5 },
		orientation: Orientation.FLAT,
		origin: 'topLeft'
	});

	// Hex dimensions as percentage of container
	const HEX_HEIGHT_PCT = HEX_WIDTH * (2.2 / 2.56);

	function getHoneycombPositions(): Array<{ xPct: number; yPct: number }> {
		const baseGrid = new Grid(Hex, rectangle({ width: 5, height: 5 }));
		const hexes: Array<InstanceType<typeof Hex>> = [];

		for (const hex of baseGrid.traverse(spiral({ start: [2, 2], radius: 1 }))) {
			if (hexes.length >= 7) break;
			hexes.push(hex);
		}

		const xs = hexes.map((h) => h.x);
		const ys = hexes.map((h) => h.y);
		const minX = Math.min(...xs);
		const maxX = Math.max(...xs);
		const minY = Math.min(...ys);
		const maxY = Math.max(...ys);
		const rangeX = maxX - minX;
		const rangeY = maxY - minY;

		const yRange = 100 - HEX_HEIGHT_PCT;

		return hexes.map((hex) => ({
			xPct: rangeX > 0 ? ((hex.x - minX) / rangeX) * (100 - HEX_WIDTH) * HEX_GAP : 0,
			yPct: rangeY > 0 ? ((hex.y - minY) / rangeY) * yRange * HEX_GAP : 50
		}));
	}

	const honeycombPositions = getHoneycombPositions();
</script>

{#if playerMat?.mat_url}
	<section class="mat-showcase">
		<div class="section-header diagonal-header">
			<div class="header-slash"></div>
			<h2>BUILD YOUR SPIRIT ENGINE</h2>
		</div>

		<div class="mat-display-wrapper">
			<div class="mat-text-content">
				<h3>50+ Team Compositions</h3>
				<p>
					Mix and match Spirits to discover powerful synergies and unique strategies. Every game
					offers new combinations to explore and master.
				</p>
			</div>
			<div class="mat-container">
				<img
					src={playerMat.mat_url}
					alt="{playerMat.guardian.name} Player Mat"
					class="player-mat-image"
				/>
				<div class="mat-spirits-layer">
					<div
						class="honeycomb-container"
						style="
							left: {OFFSET_X}%;
							top: {OFFSET_Y}%;
							height: {CONTAINER_HEIGHT}%;
							transform: scale({SCALE / 100});
							transform-origin: top left;
						"
					>
						{#each matSpirits as spirit, i (spirit.id)}
							{@const pos = honeycombPositions[i]}
							{#if pos}
								<div
									class="mat-spirit hex-tile"
									style="left: {pos.xPct}%; top: {pos.yPct}%; width: {HEX_WIDTH}%;"
								>
									<img src={spirit.image_url} alt={spirit.name} />
								</div>
							{/if}
						{/each}
					</div>
				</div>
				<div class="mat-glow"></div>
			</div>
		</div>
	</section>
{/if}
