<script lang="ts">
	// Track which box is expanded - only one at a time
	let expandedBox = $state<string | null>(null);

	function toggleBox(box: string) {
		expandedBox = expandedBox === box ? null : box;
	}
</script>

<div class="game-flow">
	<!-- Game Setup -->
	<div
		class="flow-box setup"
		class:expanded={expandedBox === 'setup'}
		onclick={() => toggleBox('setup')}
		onkeydown={(e) => e.key === 'Enter' && toggleBox('setup')}
		role="button"
		tabindex="0"
	>
		<div class="box-header">
			<span>Game Setup</span>
			<span class="expand-icon">{expandedBox === 'setup' ? '−' : '+'}</span>
		</div>
		<div class="box-preview">
			<span>Choose Guardian</span>
			<span>Prepare bags & deck</span>
			<span>Set starting resources</span>
		</div>
		<div class="expanded-content">
			<div class="setup-step">
				<span class="step-num">1</span>
				<div class="step-content">
					<strong>Choose a Guardian</strong>
					<p>Each player selects a Guardian and takes their corresponding Player mat.</p>
					<p class="step-note">Guardian "difficulty" reflects how much game knowledge is needed to play effectively (not raw power).</p>
				</div>
			</div>
			<div class="setup-step">
				<span class="step-num">2</span>
				<div class="step-content">
					<strong>Setup Spirit Bags</strong>
					<p>
						Place all <strong>Spirit World</strong> Spirits into the <strong>Spirit World Bag</strong>, and
						likewise place all <strong>Arcane Abyss</strong> Spirits into the <strong>Arcane Abyss Bag</strong>.
					</p>
				</div>
			</div>
			<div class="setup-step">
				<span class="step-num">3</span>
				<div class="step-content">
					<strong>Prepare the Monster Deck</strong>
					<p>Sort the Monster Cards by stage, and place them in a stack.</p>
				</div>
			</div>
			<div class="setup-step">
				<span class="step-num">4</span>
				<div class="step-content">
					<strong>Set Starting Resources</strong>
					<p>Set <span class="badge pure">Spirit Status</span> to Pure and <span class="badge stat">Barriers</span> to 4.</p>
				</div>
			</div>
			<div class="setup-step">
				<span class="step-num">5</span>
				<div class="step-content">
					<strong>Read the Opening Event Card</strong>
					<p>Resolve the opening event to set the stage for the game.</p>
				</div>
			</div>
		</div>
	</div>

	<div class="flow-arrow">→</div>

	<!-- Stage Box -->
	<div
		class="flow-box stage"
		class:expanded={expandedBox === 'stage'}
		onclick={() => toggleBox('stage')}
		onkeydown={(e) => e.key === 'Enter' && toggleBox('stage')}
		role="button"
		tabindex="0"
	>
		<div class="stage-header">
			<div class="header-left">
				<span class="stage-title">Stage</span>
				<div class="stage-cycle">
					<span class="cycle-nums">1 → 2 → 3 → 4</span>
				</div>
			</div>
			<span class="expand-icon">{expandedBox === 'stage' ? '−' : '+'}</span>
		</div>

		<!-- Collapsed Preview -->
		<div class="box-preview stage-preview">
			<div class="preview-row">
				<span class="preview-label">Stage Start:</span>
				<span>Reveal monsters → Boss to Abyss</span>
			</div>
			<div class="preview-row">
				<span class="preview-label">Round Loop:</span>
				<span>4 phases repeated until boss defeated</span>
			</div>
			<div class="preview-row">
				<span class="preview-label">Stage End:</span>
				<span>Boss defeated → Next stage</span>
			</div>
		</div>

		<!-- Expanded Content -->
		<div class="expanded-content">
			<!-- Stage Start Section -->
			<div class="stage-section">
				<div class="section-header">
					<span class="section-icon">▶</span>
					<strong>Stage Start</strong>
				</div>
				<p>
					Reveal all Monster Cards for that stage. This means that Monsters will then move and occupy locations
					on the Spirit World.
				</p>
				<p>Read the current Stage Event aloud to all players.</p>
				<p class="step-note">If you reveal a boss, place it in the Arcane Abyss instead.</p>
			</div>

			<!-- Round Loop Section -->
			<div class="round-loop-section">
				<div class="section-header">
					<span class="section-icon">↻</span>
					<strong>Round Loop</strong>
					<span class="section-note">(repeat until boss defeated)</span>
				</div>

				<div class="phases-grid">
					<div class="phase-card">
						<div class="phase-header">
							<span class="phase-num">1</span>
							<span class="phase-name">Realm Navigation</span>
						</div>
						<p>Everyone secretly chooses a destination on the board using the Realm Navigator.</p>
						<p class="phase-detail">Choices are hidden until everyone has decided.</p>
					</div>

					<div class="phase-card">
						<div class="phase-header">
							<span class="phase-num">2</span>
							<span class="phase-name">Navigation Reveal</span>
						</div>
						<p>Everyone reveals and moves to their chosen location simultaneously.</p>
					</div>

					<div class="phase-card">
						<div class="phase-header">
							<span class="phase-num">3</span>
							<span class="phase-name">Location Resolution</span>
						</div>
						<p>
							If a monster is present: engage in combat first. Location benefits (Gain/Trade rows) are only
							gained if the monster is defeated.
						</p>
						<p class="phase-detail">Each player resolves rewards independently.</p>
					</div>

					<div class="phase-card">
						<div class="phase-header">
							<span class="phase-num">4</span>
							<span class="phase-name">End of Round</span>
						</div>
						<p>
							Check if the current Boss is defeated, then advance to the next stage by revealing the next
							Event card. If the Boss isn't defeated, go back to 1 (Navigation).
						</p>
					</div>
				</div>
			</div>

			<!-- Stage Progression Section -->
			<div class="stage-section">
				<div class="section-header">
					<span class="section-icon">⟳</span>
					<strong>Stage Progression</strong>
				</div>
				<p>Defeating the stage boss advances the game:</p>
				<ul>
					<li><strong>Stages 1–3:</strong> Advance to the next stage and do the next stage start.</li>
					<li><strong>Stage 4:</strong> The game ends immediately when the boss is defeated.</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="flow-arrow">→</div>

	<!-- Game End -->
	<div class="flow-box end">
		<div class="box-header">
			<span>Game End</span>
		</div>
		<div class="box-content-static">
			<p>Stage 4 boss defeated</p>
			<p class="winner">Most VP wins!</p>
		</div>
	</div>
</div>

<style>
	.game-flow {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem;
		width: 100%;
	}

	.flow-arrow {
		display: flex;
		align-items: center;
		font-size: 2rem;
		color: #c4a060;
		flex-shrink: 0;
		padding-top: 2rem;
	}

	/* ══════════════════════════════════════════════════════════════
	   FLOW BOXES
	   ══════════════════════════════════════════════════════════════ */
	.flow-box {
		background: #12121a;
		border: 1px solid rgba(196, 160, 96, 0.3);
		border-radius: 6px;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.flow-box:hover {
		border-color: rgba(196, 160, 96, 0.6);
	}

	.flow-box:focus {
		outline: 2px solid #c4a060;
		outline-offset: 2px;
	}

	.flow-box.setup {
		flex: 0 0 180px;
	}

	.flow-box.end {
		flex: 0 0 160px;
		cursor: default;
	}

	.flow-box.stage {
		flex: 1;
		border-color: rgba(196, 160, 96, 0.5);
	}

	.flow-box.expanded {
		border-color: #c4a060;
		box-shadow: 0 0 30px rgba(196, 160, 96, 0.2);
	}

	.flow-box.setup.expanded {
		flex: 0 0 380px;
	}

	.flow-box.end:hover {
		border-color: rgba(196, 160, 96, 0.3);
	}

	/* ══════════════════════════════════════════════════════════════
	   HEADERS
	   ══════════════════════════════════════════════════════════════ */
	.box-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, #c4a060 0%, #8b7355 100%);
		font-family: 'Opsilon', sans-serif;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #0a0a0f;
	}

	.flow-box.end .box-header {
		background: linear-gradient(135deg, rgba(196, 160, 96, 0.3) 0%, rgba(139, 115, 85, 0.3) 100%);
		color: #c4a060;
		border-bottom: 1px solid rgba(196, 160, 96, 0.3);
	}

	.stage-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #c4a060 0%, #8b7355 100%);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stage-title {
		font-family: 'Opsilon', sans-serif;
		font-size: 1.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #0a0a0f;
	}

	.cycle-nums {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		color: #0a0a0f;
		background: rgba(0, 0, 0, 0.2);
		padding: 0.25rem 0.75rem;
		border-radius: 3px;
	}

	.expand-icon {
		font-size: 1.25rem;
		font-weight: 400;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.stage-header .expand-icon {
		color: #0a0a0f;
	}

	.flow-box:hover .expand-icon {
		opacity: 1;
	}

	/* ══════════════════════════════════════════════════════════════
	   PREVIEW (collapsed state)
	   ══════════════════════════════════════════════════════════════ */
	.box-preview {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1rem;
		font-size: 0.85rem;
		color: rgba(240, 237, 230, 0.7);
	}

	.flow-box.expanded .box-preview {
		display: none;
	}

	.stage-preview {
		padding: 1rem 1.25rem;
	}

	.preview-row {
		display: flex;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	.preview-label {
		color: #c4a060;
		font-weight: 600;
		flex-shrink: 0;
	}

	.winner {
		color: #c4a060;
		font-weight: 600;
		margin-top: 0.25rem;
	}

	/* Static content (non-expandable) */
	.box-content-static {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		text-align: center;
	}

	.box-content-static p {
		font-size: 0.85rem;
		color: rgba(240, 237, 230, 0.7);
		margin: 0;
	}

	.box-content-static .winner {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	/* ══════════════════════════════════════════════════════════════
	   EXPANDED CONTENT
	   ══════════════════════════════════════════════════════════════ */
	.expanded-content {
		max-height: 0;
		overflow: hidden;
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.flow-box.expanded .expanded-content {
		max-height: 1200px;
		opacity: 1;
		padding: 1rem;
	}

	.flow-box.stage.expanded .expanded-content {
		padding: 1.25rem;
	}

	/* Setup Steps */
	.setup-step {
		display: flex;
		gap: 0.75rem;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		background: rgba(196, 160, 96, 0.05);
		border-left: 3px solid #c4a060;
		border-radius: 0 4px 4px 0;
		animation: slideIn 0.3s ease forwards;
		opacity: 0;
	}

	.flow-box.expanded .setup-step:nth-child(1) { animation-delay: 0.05s; }
	.flow-box.expanded .setup-step:nth-child(2) { animation-delay: 0.1s; }
	.flow-box.expanded .setup-step:nth-child(3) { animation-delay: 0.15s; }
	.flow-box.expanded .setup-step:nth-child(4) { animation-delay: 0.2s; }
	.flow-box.expanded .setup-step:nth-child(5) { animation-delay: 0.25s; }

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.step-num {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #c4a060;
		color: #0a0a0f;
		font-family: 'Opsilon', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.step-content strong {
		display: block;
		font-family: 'Opsilon', sans-serif;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #e8c874;
		margin-bottom: 0.25rem;
	}

	.step-content p {
		font-size: 0.85rem;
		line-height: 1.5;
		color: rgba(240, 237, 230, 0.7);
		margin: 0;
	}

	.step-note {
		font-size: 0.8rem !important;
		color: rgba(240, 237, 230, 0.5) !important;
		font-style: italic;
		margin-top: 0.25rem !important;
	}

	/* Badges */
	.badge {
		display: inline-block;
		padding: 0.1rem 0.4rem;
		font-family: 'Opsilon', sans-serif;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 2px;
	}

	.badge.pure {
		background: rgba(100, 180, 100, 0.2);
		color: #8fd88f;
		border: 1px solid rgba(100, 180, 100, 0.3);
	}

	.badge.stat {
		background: #c4a060;
		color: #0a0a0f;
	}

	/* ══════════════════════════════════════════════════════════════
	   STAGE SECTIONS
	   ══════════════════════════════════════════════════════════════ */
	.stage-section {
		padding: 1rem;
		margin-bottom: 1rem;
		background: rgba(196, 160, 96, 0.05);
		border-radius: 4px;
		animation: slideIn 0.3s ease forwards;
		opacity: 0;
	}

	.flow-box.expanded .stage-section:nth-of-type(1) { animation-delay: 0.05s; }
	.flow-box.expanded .stage-section:nth-of-type(2) { animation-delay: 0.35s; }

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.section-icon {
		color: #c4a060;
		font-size: 1rem;
	}

	.section-header strong {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #e8c874;
	}

	.section-note {
		font-size: 0.75rem;
		color: rgba(240, 237, 230, 0.5);
		font-style: italic;
		margin-left: auto;
	}

	.stage-section p {
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(240, 237, 230, 0.75);
		margin: 0 0 0.5rem 0;
	}

	.stage-section ul {
		margin: 0.5rem 0 0 0;
		padding-left: 1.25rem;
	}

	.stage-section li {
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba(240, 237, 230, 0.75);
		margin-bottom: 0.25rem;
	}

	/* ══════════════════════════════════════════════════════════════
	   ROUND LOOP SECTION
	   ══════════════════════════════════════════════════════════════ */
	.round-loop-section {
		padding: 1rem;
		margin-bottom: 1rem;
		background: rgba(196, 160, 96, 0.08);
		border: 2px dashed rgba(196, 160, 96, 0.3);
		border-radius: 6px;
		animation: slideIn 0.3s ease forwards;
		animation-delay: 0.1s;
		opacity: 0;
	}

	.phases-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.phase-card {
		padding: 1rem;
		background: #12121a;
		border: 1px solid rgba(196, 160, 96, 0.2);
		border-left: 3px solid #c4a060;
		border-radius: 0 4px 4px 0;
		animation: slideIn 0.3s ease forwards;
		opacity: 0;
	}

	.flow-box.expanded .phase-card:nth-child(1) { animation-delay: 0.15s; }
	.flow-box.expanded .phase-card:nth-child(2) { animation-delay: 0.2s; }
	.flow-box.expanded .phase-card:nth-child(3) { animation-delay: 0.25s; }
	.flow-box.expanded .phase-card:nth-child(4) { animation-delay: 0.3s; }

	.phase-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.phase-num {
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #c4a060;
		color: #0a0a0f;
		font-family: 'Opsilon', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.phase-name {
		font-family: 'Opsilon', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #e8c874;
	}

	.phase-card p {
		font-size: 0.85rem;
		line-height: 1.5;
		color: rgba(240, 237, 230, 0.7);
		margin: 0 0 0.25rem 0;
	}

	.phase-detail {
		font-size: 0.8rem !important;
		color: rgba(240, 237, 230, 0.5) !important;
		font-style: italic;
	}

	/* ══════════════════════════════════════════════════════════════
	   RESPONSIVE
	   ══════════════════════════════════════════════════════════════ */
	@media (max-width: 900px) {
		.game-flow {
			flex-direction: column;
			align-items: stretch;
		}

		.flow-arrow {
			justify-content: center;
			transform: rotate(90deg);
			padding: 0.5rem;
		}

		.flow-box.setup,
		.flow-box.end,
		.flow-box.setup.expanded {
			flex: none;
		}

		.header-left {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.phases-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
