<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';

	let { data } = $props<{
		data: { stageNum: number; label: string; isFinal?: boolean };
	}>();
</script>

<div class="stage-node" class:final={data.isFinal}>
	<Handle type="target" position={Position.Top} id="top" />
	<Handle type="target" position={Position.Left} id="left" />
	<Handle type="source" position={Position.Right} id="right" />
	<Handle type="source" position={Position.Bottom} id="bottom" />

	<div class="stage-num">{data.stageNum}</div>
	<div class="stage-label">{data.label}</div>
	{#if data.isFinal}
		<div class="final-badge">FINAL</div>
	{/if}
	<div class="stage-content">
		<span class="content-line">Reveal monsters</span>
		<span class="content-line">Boss → Abyss</span>
	</div>
</div>

<style>
	.stage-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 14px 18px;
		background: #12121a;
		border: 1px solid rgba(196, 160, 96, 0.3);
		border-radius: 4px;
		min-width: 120px;
		position: relative;
	}

	.stage-node.final {
		border-color: #c4a060;
		box-shadow: 0 0 25px rgba(196, 160, 96, 0.25);
		background: linear-gradient(135deg, #1a1a24 0%, #12121a 100%);
	}

	.stage-num {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #c4a060;
		color: #0a0a0f;
		font-family: 'Opsilon', sans-serif;
		font-size: 14px;
		font-weight: 700;
		border-radius: 2px;
	}

	.stage-label {
		font-family: 'Opsilon', sans-serif;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(240, 237, 230, 0.9);
	}

	.final-badge {
		position: absolute;
		top: -8px;
		right: -8px;
		padding: 2px 6px;
		background: #c4a060;
		color: #0a0a0f;
		font-family: 'Opsilon', sans-serif;
		font-size: 8px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		border-radius: 2px;
	}

	.stage-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		margin-top: 4px;
		padding-top: 6px;
		border-top: 1px solid rgba(196, 160, 96, 0.15);
	}

	.content-line {
		font-size: 9px;
		color: rgba(240, 237, 230, 0.5);
		font-style: italic;
	}

	:global(.stage-node .svelte-flow__handle) {
		background: rgba(196, 160, 96, 0.6);
		width: 6px;
		height: 6px;
		border: none;
	}

	:global(.stage-node.final .svelte-flow__handle) {
		background: #c4a060;
	}
</style>
