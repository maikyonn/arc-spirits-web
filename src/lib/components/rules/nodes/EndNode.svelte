<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';

	let { data } = $props<{ data: { label: string; note: string } }>();
</script>

<div class="end-node">
	<Handle type="target" position={Position.Left} id="left" />
	<Handle type="target" position={Position.Top} id="top" />
	<span class="label">{data.label}</span>
	<span class="note">{data.note}</span>
</div>

<style>
	.end-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 16px 28px;
		background: linear-gradient(135deg, rgba(196, 160, 96, 0.2) 0%, rgba(10, 10, 15, 0.9) 100%);
		border: 2px solid #c4a060;
		border-radius: 4px;
		box-shadow: 0 0 30px rgba(196, 160, 96, 0.3);
	}

	.label {
		font-family: 'Opsilon', sans-serif;
		font-size: 16px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: #c4a060;
	}

	.note {
		font-family: 'Cormorant Garamond', serif;
		font-size: 12px;
		font-style: italic;
		color: rgba(240, 237, 230, 0.6);
	}

	:global(.end-node .svelte-flow__handle) {
		background: #c4a060;
		width: 8px;
		height: 8px;
		border: none;
	}
</style>
