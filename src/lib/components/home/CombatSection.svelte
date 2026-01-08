<script lang="ts">
	let isCoopExpanded = $state(false);
</script>

<section id="combat" class="content-section">
	<div class="section-header diagonal-header">
		<div class="header-badge">05</div>
		<h2>COMBAT (QUICK)</h2>
	</div>

	<div class="combat-note">
		<span class="note-slash">//</span>
		<p>This mod doesn't fully automate combat; it gives you tools to do it quickly.</p>
	</div>

	<div class="combat-steps">
		<div class="combat-step">
			<div class="combat-marker">01</div>
			<div class="combat-content">
				<h3>Check Your Classes</h3>
				<p>Right sidebar → click a class to view its breakpoint effects.</p>
			</div>
		</div>
		<div class="combat-step">
			<div class="combat-marker">02</div>
			<div class="combat-content">
				<h3>Spawn Dice</h3>
				<p>Use <strong>Spawn Dice</strong> to spawn the dice you plan to roll.</p>
			</div>
		</div>
		<div class="combat-step">
			<div class="combat-marker">03</div>
			<div class="combat-content">
				<h3>Roll & Total</h3>
				<p>
					Roll, total your damage, compare to the monster's <strong>Barrier</strong>.
				</p>
			</div>
		</div>
		<div class="combat-step">
			<div class="combat-marker">04</div>
			<div class="combat-content">
				<h3>Apply Results</h3>
				<p>
					Apply damage taken to your <strong>Barriers</strong>. Fighting grants monster drops;
					defeating it awards <strong>VP</strong> and removes it from the map.
				</p>
			</div>
		</div>
	</div>

	<button
		class="detail-toggle"
		onclick={() => (isCoopExpanded = !isCoopExpanded)}
		aria-expanded={isCoopExpanded}
	>
		<span class="toggle-icon">{isCoopExpanded ? '−' : '+'}</span>
		Optional detail: Most fights are cooperative
	</button>
	{#if isCoopExpanded}
		<div class="detail-content">
			<p>
				Players at the same location usually <strong>pool their attack</strong> against the monster.
				Damage is still applied <strong>per player</strong> (use your own defenses/reductions).
			</p>
		</div>
	{/if}
</section>
