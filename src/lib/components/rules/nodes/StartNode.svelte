<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';

	let { data } = $props<{ data: { label: string } }>();
</script>

<div class="start-node">
	<span class="label">{data.label}</span>
	<Handle type="source" position={Position.Right} id="right" />
	<Handle type="source" position={Position.Bottom} id="bottom" />
</div>

<style>
	.start-node {
		padding: 12px 24px;
		background: linear-gradient(135deg, #c4a060 0%, #8b7355 100%);
		border: 2px solid #c4a060;
		border-radius: 4px;
		box-shadow: 0 0 20px rgba(196, 160, 96, 0.4);
	}

	.label {
		font-family: 'Opsilon', sans-serif;
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #0a0a0f;
	}

	:global(.start-node .svelte-flow__handle) {
		background: #c4a060;
		width: 8px;
		height: 8px;
		border: none;
	}
</style>
