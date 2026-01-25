<script lang="ts">
</script>

<svelte:head>
	<title>Arc Spirits - Examples</title>
	<meta name="description" content="Arc Spirits gameplay examples" />
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
	</nav>

	<main class="rules-main no-toc">
		<div class="rules-content">
			<!-- Navigation Round Example -->
			<section id="navigation-example" class="chapter">
				<div class="chapter-header">
					<h2 class="chapter-title">Navigation Round Example</h2>
					<div class="chapter-line"></div>
				</div>

				<div class="chapter-content">
					<p class="tree-intro">
						This example demonstrates a basic round where players navigate to locations without monsters.
					</p>
				</div>
			</section>

			<!-- Basic Monster Round Example -->
			<section id="monster-example" class="chapter">
				<div class="chapter-header">
					<h2 class="chapter-title">Basic Monster Round Example</h2>
					<div class="chapter-line"></div>
				</div>

				<div class="chapter-content">
					<p class="tree-intro">
						This example demonstrates a round where players encounter and fight a monster at a location.
					</p>
				</div>
			</section>

			<!-- Arcane Hysteria Round Example -->
			<section id="hysteria-example" class="chapter">
				<div class="chapter-header">
					<h2 class="chapter-title">Arcane Hysteria Round Example</h2>
					<div class="chapter-line"></div>
				</div>

				<div class="chapter-content">
					<p class="tree-intro">
						This example demonstrates a round where a monster with Arcane Hysteria triggers PvP combat among players.
					</p>
				</div>
			</section>
		</div>
	</main>
</div>
