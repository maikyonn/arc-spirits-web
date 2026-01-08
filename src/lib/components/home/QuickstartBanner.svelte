<script lang="ts">
	let { onNavigate } = $props<{ onNavigate: (id: string) => void }>();
</script>

<div class="quickstart-banner">
	<div class="quickstart-inner">
		<span class="qs-icon">/!</span>
		<p>
			<strong>First time?</strong> You only need:
			<button onclick={() => onNavigate('glance')} class="inline-link">At a Glance</button>
			<span class="arrow">//</span>
			<button onclick={() => onNavigate('loop')} class="inline-link">The Loop</button>
			<span class="arrow">//</span>
			<button onclick={() => onNavigate('tts')} class="inline-link">Playing in TTS</button>
			<span class="arrow">//</span>
			<button onclick={() => onNavigate('combat')} class="inline-link">Combat</button>
		</p>
	</div>
</div>
