<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchTTSData } from '$lib/data/store';
	import type { Guardian, GameLocation } from '$lib/data/types';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	let guardians = $state<Guardian[]>([]);
	let locations = $state<GameLocation[]>([]);
	let isLoaded = $state(false);

	// Element references for animations
	let actionResultsRow: HTMLElement;
	let battleEffects: HTMLElement;
	let coopBattleBox: HTMLElement;

	// Destinations for each row (will use real location names when loaded)
	const defaultDestinations1 = ['Astral Zone', 'Fairy Oasis', 'Lantern Lights', 'Arcane Abyss'];
	const defaultDestinations2 = ['Crystal Caves', 'Shadow Realm', 'Spirit Grove', 'Mystic Falls'];

	let destinations1 = $state<string[]>(defaultDestinations1);
	let destinations2 = $state<string[]>(defaultDestinations2);

	onMount(async () => {
		try {
			const data = await fetchTTSData();
			// Get guardians with chibi images (API uses chibi_image_url field)
			guardians = data.guardians.filter((g: any) => g.chibi_image_url);
			locations = data.game_locations;

			// Use real location names if available
			if (locations.length >= 8) {
				const shuffled = [...locations].sort(() => Math.random() - 0.5);
				destinations1 = shuffled.slice(0, 4).map((l) => l.name);
				destinations2 = shuffled.slice(4, 8).map((l) => l.name);
			}

			isLoaded = true;

			// Setup scroll-triggered battle animations
			setupBattleAnimations();
		} catch (error) {
			console.error('Failed to load guardian data:', error);
			isLoaded = true;
		}
	});

	function setupBattleAnimations() {
		if (!actionResultsRow || !battleEffects) return;

		// Create timeline for battle sequence
		const battleTl = gsap.timeline({
			scrollTrigger: {
				trigger: actionResultsRow,
				start: 'top 80%',
				end: 'bottom 20%',
				scrub: 1,
				toggleActions: 'play none none reverse'
			}
		});

		// Animate battle sparks appearing
		battleTl.fromTo(
			'.battle-spark',
			{
				scale: 0,
				opacity: 0,
				rotation: 0
			},
			{
				scale: 1,
				opacity: 1,
				rotation: 180,
				stagger: 0.1,
				duration: 0.5,
				ease: 'back.out(2)'
			}
		);

		// Shake effect on the coop battle box
		battleTl.to(
			coopBattleBox,
			{
				keyframes: [
					{ x: -3, duration: 0.05 },
					{ x: 3, duration: 0.05 },
					{ x: -2, duration: 0.05 },
					{ x: 2, duration: 0.05 },
					{ x: 0, duration: 0.05 }
				],
				ease: 'none'
			},
			'-=0.3'
		);

		// Animate impact burst
		battleTl.fromTo(
			'.impact-burst',
			{
				scale: 0,
				opacity: 0
			},
			{
				scale: 1.5,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out'
			},
			'-=0.2'
		);

		battleTl.to('.impact-burst', {
			scale: 2,
			opacity: 0,
			duration: 0.4,
			ease: 'power2.in'
		});

		// Animate clash lines
		battleTl.fromTo(
			'.clash-line',
			{
				scaleX: 0,
				opacity: 0
			},
			{
				scaleX: 1,
				opacity: 1,
				stagger: 0.05,
				duration: 0.2,
				ease: 'power2.out'
			},
			'-=0.5'
		);

		battleTl.to(
			'.clash-line',
			{
				opacity: 0,
				duration: 0.3
			},
			'+=0.1'
		);
	}
</script>

<section class="intro-section">
	<div class="section-header diagonal-header">
		<div class="header-slash"></div>
		<h2>WHAT MAKES ARC SPIRITS SPECIAL</h2>
	</div>
	<div class="feature-grid">
		<div class="feature-card">
			<div class="card-slash"></div>
			<div class="feature-icon parallel">
				<span>//</span>
			</div>
			<h3>Parallel Turns</h3>
			<p>Everyone chooses in secret, then everything resolves together. No waiting!</p>
		</div>
		<div class="feature-card">
			<div class="card-slash"></div>
			<div class="feature-icon types">
				<span>+</span>
			</div>
			<h3>Types + Roles</h3>
			<p>
				Hex Spirit tiles are defined by icons — <strong>Origins</strong> (type) and
				<strong>Classes</strong> (function).
			</p>
		</div>
		<div class="feature-card">
			<div class="card-slash"></div>
			<div class="feature-icon unique">
				<span>*</span>
			</div>
			<h3>Unique-Set Bonuses</h3>
			<p>Origins reward variety — no duplicates count! Build diverse for better bonuses.</p>
		</div>
		<div class="feature-card">
			<div class="card-slash"></div>
			<div class="feature-icon corruption">
				<span>!</span>
			</div>
			<h3>Corruption Push-Your-Luck</h3>
			<p>
				Spend Arcane Blood for power spikes, but slipping from <strong>Pure → Fallen</strong> limits
				your spirits.
			</p>
		</div>
		<div class="feature-card">
			<div class="card-slash"></div>
			<div class="feature-icon victory">
				<span>VP</span>
			</div>
			<h3>Fight for Drops, Win for VP</h3>
			<p>Monsters pay out when you engage; defeating them earns VP and clears the board.</p>
		</div>
	</div>

	<!-- Parallel Turns Visualization -->
	<div class="parallel-showcase" class:loaded={isLoaded}>
		<div class="section-header diagonal-header">
			<div class="header-slash"></div>
			<h2>SIMULTANEOUS PLANNING</h2>
		</div>

		<!-- First Row of Guardians -->
		<div class="guardian-row">
			{#each Array(4) as _, i}
				<div class="guardian-slot" style="--delay: {i * 0.15}s">
					<div class="speech-bubble">
						<span class="destination">{destinations1[i]}</span>
						<div class="bubble-tail"></div>
					</div>
					<div class="guardian-avatar">
						{#if (guardians[i] as any)?.chibi_image_url}
							<img src={(guardians[i] as any).chibi_image_url} alt={guardians[i].name} />
						{:else}
							<div class="avatar-placeholder">
								<span>P{i + 1}</span>
							</div>
						{/if}
					</div>
					<span class="guardian-label">{guardians[i]?.name || `Player ${i + 1}`}</span>
				</div>
			{/each}
		</div>

		<!-- Action Results Row -->
		<div class="action-results-row" bind:this={actionResultsRow}>
			<div class="action-slot">
				<div class="action-box single">
					<span>gained Barrier</span>
				</div>
			</div>
			<div class="action-slot coop-battle">
				<div class="action-box joined" bind:this={coopBattleBox}>
					<span>engaged in a coop battle</span>
				</div>
				<!-- Battle Effects Container -->
				<div class="battle-effects" bind:this={battleEffects}>
					<!-- Impact burst -->
					<div class="impact-burst"></div>
					<!-- Sparks -->
					<div class="battle-spark spark-1">✦</div>
					<div class="battle-spark spark-2">✧</div>
					<div class="battle-spark spark-3">⚔</div>
					<div class="battle-spark spark-4">✦</div>
					<div class="battle-spark spark-5">✧</div>
					<!-- Clash lines -->
					<div class="clash-line line-1"></div>
					<div class="clash-line line-2"></div>
					<div class="clash-line line-3"></div>
				</div>
			</div>
			<div class="action-slot">
				<div class="action-box single">
					<span>found a monster</span>
				</div>
			</div>
		</div>

		<!-- Second Row of Guardians (same guardians) -->
		<div class="guardian-row row-2">
			{#each Array(4) as _, i}
				<div class="guardian-slot" style="--delay: {(i + 4) * 0.15}s">
					<div class="guardian-avatar">
						{#if (guardians[i] as any)?.chibi_image_url}
							<img src={(guardians[i] as any).chibi_image_url} alt={guardians[i].name} />
						{:else}
							<div class="avatar-placeholder">
								<span>P{i + 1}</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Time Comparison Callout -->
		<div class="time-callout">
			<div class="time-comparison">
				<div class="time-block ours">
					<span class="time-value">~3</span>
					<span class="time-unit">min</span>
					<span class="time-label">per round</span>
				</div>
				<div class="vs-divider">
					<span>vs</span>
				</div>
				<div class="time-block theirs">
					<span class="time-value">10+</span>
					<span class="time-unit">min</span>
					<span class="time-label">traditional</span>
				</div>
			</div>
			<p class="time-explanation">
				<strong>Parallel turns</strong> mean everyone plans simultaneously — no waiting for other
				players to finish their turn!
			</p>
		</div>
	</div>
</section>

<style>
	/* Parallel Showcase - Inline with page */
	.parallel-showcase {
		margin-top: 4rem;
		position: relative;
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	.parallel-showcase.loaded {
		opacity: 1;
		transform: translateY(0);
	}

	/* Guardian Row */
	.guardian-row {
		display: flex;
		justify-content: space-evenly;
		align-items: flex-end;
		gap: 0.5rem;
		position: relative;
		z-index: 1;
		padding: 1rem 0;
	}

	.guardian-slot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		max-width: 280px;
		animation: fadeInUp 0.5s ease both;
		animation-delay: var(--delay);
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Speech Bubble */
	.speech-bubble {
		position: relative;
		background: linear-gradient(135deg, rgba(196, 160, 96, 0.15) 0%, rgba(196, 160, 96, 0.08) 100%);
		border: 1px solid rgba(196, 160, 96, 0.4);
		padding: 0.5rem 0.9rem;
		transform: skewX(-5deg);
		animation: bubblePop 0.4s ease both;
		animation-delay: calc(var(--delay) + 0.2s);
	}

	@keyframes bubblePop {
		0% {
			opacity: 0;
			transform: skewX(-5deg) scale(0.8);
		}
		60% {
			transform: skewX(-5deg) scale(1.05);
		}
		100% {
			opacity: 1;
			transform: skewX(-5deg) scale(1);
		}
	}

	.speech-bubble::before {
		content: '';
		position: absolute;
		top: -1px;
		left: -1px;
		right: -1px;
		height: 2px;
		background: linear-gradient(90deg, var(--color-arcane-gold), transparent);
	}

	.bubble-tail {
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%) skewX(5deg);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid rgba(196, 160, 96, 0.4);
	}

	.destination {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.7rem;
		color: var(--color-arcane-gold);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transform: skewX(5deg);
		display: block;
		white-space: nowrap;
	}

	/* Guardian Avatar */
	.guardian-avatar {
		width: 100%;
		max-width: 360px;
		height: auto;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		transition: transform 0.3s ease;
	}

	.guardian-slot:hover .guardian-avatar {
		transform: scale(1.08) translateY(-4px);
	}

	.guardian-avatar img {
		width: 100%;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
	}

	.avatar-placeholder {
		width: 60px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-dark-violet), rgba(196, 160, 96, 0.2));
		border: 1px solid rgba(196, 160, 96, 0.3);
	}

	.avatar-placeholder span {
		font-family: 'Opsilon', sans-serif;
		font-size: 1.2rem;
		color: var(--color-arcane-gold);
	}

	.guardian-label {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.65rem;
		color: var(--color-muted-lavender);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		max-width: 80px;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Action Results Row */
	.action-results-row {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem 0;
		position: relative;
		overflow: visible;
	}

	.action-slot {
		flex: 1;
		max-width: 280px;
		display: flex;
		justify-content: center;
	}

	.action-slot.coop-battle {
		flex: 2;
		max-width: 560px;
		position: relative;
		overflow: visible;
	}

	.action-box {
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, rgba(196, 160, 96, 0.12) 0%, rgba(196, 160, 96, 0.05) 100%);
		border: 1px solid rgba(196, 160, 96, 0.4);
		transform: skewX(-5deg);
		text-align: center;
	}

	.action-box.joined {
		border: 2px solid rgba(196, 160, 96, 0.6);
		box-shadow: 0 0 20px rgba(196, 160, 96, 0.15);
	}

	.action-box span {
		display: block;
		font-family: 'Opsilon', sans-serif;
		font-size: 0.8rem;
		color: var(--color-arcane-gold);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transform: skewX(5deg);
	}

	.action-box.joined span {
		font-size: 0.9rem;
	}

	/* Battle Effects */
	.battle-effects {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 200%;
		height: 300px;
		pointer-events: none;
		z-index: 10;
	}

	.impact-burst {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120px;
		height: 120px;
		background: radial-gradient(circle, rgba(196, 160, 96, 0.9) 0%, rgba(255, 200, 100, 0.5) 30%, transparent 70%);
		border-radius: 50%;
		opacity: 0;
		filter: blur(2px);
	}

	.battle-spark {
		position: absolute;
		font-size: 2rem;
		color: var(--color-arcane-gold);
		text-shadow: 0 0 15px rgba(196, 160, 96, 1), 0 0 30px rgba(196, 160, 96, 0.7);
		opacity: 0;
	}

	.spark-1 {
		top: 20%;
		left: 15%;
	}

	.spark-2 {
		top: 25%;
		right: 15%;
	}

	.spark-3 {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 3rem;
		color: #ff6b6b;
		text-shadow: 0 0 20px rgba(255, 107, 107, 1), 0 0 40px rgba(255, 107, 107, 0.7);
	}

	.spark-4 {
		bottom: 25%;
		left: 20%;
	}

	.spark-5 {
		bottom: 20%;
		right: 20%;
	}

	.clash-line {
		position: absolute;
		height: 4px;
		background: linear-gradient(90deg, transparent 0%, var(--color-arcane-gold) 20%, var(--color-arcane-gold) 80%, transparent 100%);
		opacity: 0;
		transform-origin: center;
		box-shadow: 0 0 10px rgba(196, 160, 96, 0.8);
	}

	.line-1 {
		top: 35%;
		left: 15%;
		right: 15%;
		transform: rotate(-10deg);
	}

	.line-2 {
		top: 50%;
		left: 10%;
		right: 10%;
	}

	.line-3 {
		top: 65%;
		left: 15%;
		right: 15%;
		transform: rotate(10deg);
	}

	/* Time Callout */
	.time-callout {
		margin-top: 2.5rem;
		padding: 1.5rem 2rem;
		background: linear-gradient(90deg, rgba(196, 160, 96, 0.08) 0%, rgba(196, 160, 96, 0.02) 100%);
		border-left: 4px solid var(--color-arcane-gold);
		position: relative;
		z-index: 1;
	}

	.time-comparison {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.time-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 1.5rem;
		background: rgba(0, 0, 0, 0.3);
		transform: skewX(-5deg);
	}

	.time-block.ours {
		border: 2px solid var(--color-arcane-gold);
		box-shadow: 0 0 20px rgba(196, 160, 96, 0.2);
	}

	.time-block.theirs {
		border: 1px solid rgba(196, 160, 96, 0.2);
		opacity: 0.6;
	}

	.time-value {
		font-family: 'Opsilon', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		transform: skewX(5deg);
	}

	.time-block.ours .time-value {
		color: var(--color-arcane-gold);
	}

	.time-block.theirs .time-value {
		color: var(--color-muted-lavender);
	}

	.time-unit {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		transform: skewX(5deg);
		margin-top: 0.25rem;
	}

	.time-block.ours .time-unit {
		color: var(--color-cream-text);
	}

	.time-block.theirs .time-unit {
		color: var(--color-dusty-rose);
	}

	.time-label {
		font-family: 'Cormorant Garamond', serif;
		font-size: 0.75rem;
		color: var(--color-dusty-rose);
		font-style: italic;
		transform: skewX(5deg);
		margin-top: 0.5rem;
	}

	.vs-divider {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vs-divider span {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.9rem;
		color: var(--color-tainted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.time-explanation {
		text-align: center;
		font-size: 0.95rem;
		color: var(--color-muted-lavender);
		margin: 0;
		line-height: 1.6;
	}

	.time-explanation strong {
		color: var(--color-arcane-gold);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.parallel-showcase {
			margin-top: 3rem;
		}

		.guardian-avatar {
			max-width: 140px;
		}

		.guardian-slot {
			max-width: 160px;
		}

		.destination {
			font-size: 0.55rem;
		}

		.speech-bubble {
			padding: 0.35rem 0.5rem;
		}

		.action-box {
			padding: 0.5rem 0.75rem;
		}

		.action-box span {
			font-size: 0.65rem;
		}

		.action-box.joined span {
			font-size: 0.7rem;
		}

		.time-block {
			padding: 0.75rem 1rem;
		}

		.time-value {
			font-size: 2rem;
		}
	}

	@media (max-width: 480px) {
		.guardian-avatar {
			max-width: 100px;
		}

		.guardian-slot {
			max-width: 110px;
		}

		.guardian-label {
			font-size: 0.55rem;
			max-width: 80px;
		}

		.speech-bubble {
			padding: 0.3rem 0.4rem;
		}

		.destination {
			font-size: 0.5rem;
		}

		.action-results-row {
			flex-wrap: wrap;
			gap: 0.75rem;
		}

		.action-slot,
		.action-slot.coop-battle {
			flex: 0 0 auto;
			max-width: none;
		}

		.action-box {
			padding: 0.4rem 0.6rem;
		}

		.action-box span {
			font-size: 0.55rem;
		}
	}
</style>
