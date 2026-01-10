<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';

	type Phase = { num: number; name: string };
	let { data } = $props<{ data: { phases: Phase[] } }>();
</script>

<div class="round-loop-node">
	<!-- Multiple target handles for stages to connect to -->
	<Handle type="target" position={Position.Top} id="top-1" style="left: 15%;" />
	<Handle type="target" position={Position.Top} id="top-2" style="left: 38%;" />
	<Handle type="target" position={Position.Top} id="top-3" style="left: 62%;" />
	<Handle type="target" position={Position.Top} id="top-4" style="left: 85%;" />

	<div class="loop-header">
		<div class="loop-icon">↻</div>
		<span class="loop-title">Round Loop</span>
		<span class="loop-subtitle">Repeats until stage boss defeated</span>
	</div>

	<div class="phases-container">
		{#each data.phases as phase, i}
			<div class="phase-row">
				<div class="phase-num">{phase.num}</div>
				<div class="phase-name">{phase.name}</div>
				{#if i < data.phases.length - 1}
					<div class="phase-arrow">→</div>
				{/if}
			</div>
			{#if i < data.phases.length - 1}
				<div class="connector">↓</div>
			{/if}
		{/each}
	</div>

	<div class="loop-footer">
		<div class="loop-back">
			<span class="back-arrow">↺</span>
			<span class="back-text">Next round (if boss not defeated)</span>
		</div>
	</div>
</div>

<style>
	.round-loop-node {
		padding: 16px;
		background: rgba(196, 160, 96, 0.05);
		border: 2px dashed rgba(196, 160, 96, 0.4);
		border-radius: 6px;
		min-width: 460px;
		position: relative;
	}

	.loop-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(196, 160, 96, 0.2);
	}

	.loop-icon {
		font-size: 20px;
		color: #c4a060;
	}

	.loop-title {
		font-family: 'Opsilon', sans-serif;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: #c4a060;
	}

	.loop-subtitle {
		font-family: 'Cormorant Garamond', serif;
		font-size: 11px;
		color: rgba(240, 237, 230, 0.5);
		font-style: italic;
		margin-left: auto;
	}

	.phases-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.phase-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 12px;
		background: #12121a;
		border: 1px solid rgba(196, 160, 96, 0.15);
		border-left: 3px solid #c4a060;
	}

	.phase-num {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #c4a060;
		color: #0a0a0f;
		font-family: 'Opsilon', sans-serif;
		font-size: 12px;
		font-weight: 700;
		border-radius: 2px;
	}

	.phase-name {
		font-family: 'Opsilon', sans-serif;
		font-size: 11px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(240, 237, 230, 0.85);
	}

	.phase-arrow {
		margin-left: auto;
		color: rgba(196, 160, 96, 0.4);
		font-size: 14px;
	}

	.connector {
		text-align: center;
		color: rgba(196, 160, 96, 0.4);
		font-size: 12px;
		padding: 2px 0;
	}

	.loop-footer {
		margin-top: 12px;
		padding-top: 10px;
		border-top: 1px solid rgba(196, 160, 96, 0.2);
	}

	.loop-back {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.back-arrow {
		font-size: 16px;
		color: #c4a060;
	}

	.back-text {
		font-size: 10px;
		color: rgba(240, 237, 230, 0.5);
		font-style: italic;
	}

	:global(.round-loop-node .svelte-flow__handle) {
		background: rgba(196, 160, 96, 0.6);
		width: 6px;
		height: 6px;
		border: none;
	}
</style>
