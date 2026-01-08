<script lang="ts">
	type FooterStats = {
		uniqueSpirits: number;
		origins: number;
		classes: number;
	} | null;

	let { stats } = $props<{ stats: FooterStats }>();
</script>

<footer class="footer">
	<div class="footer-content">
		<span class="footer-slash">//</span>
		<span>ARC SPIRITS — TTS NEW PLAYER GUIDE</span>
		{#if stats}
			<span class="footer-stats"
				>// {stats.uniqueSpirits} spirits // {stats.origins} origins // {stats.classes} classes</span
			>
		{/if}
	</div>
</footer>
