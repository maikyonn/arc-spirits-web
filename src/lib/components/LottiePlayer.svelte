<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { AnimationItem, RendererType } from 'lottie-web';

	let {
		path,
		animationData,
		loop = true,
		autoplay = true,
		renderer = 'svg',
		speed = 1,
		direction = 1,
		class: className = '',
		style = '',
		ariaLabel = 'Animation'
	} = $props<{
		path?: string;
		animationData?: object;
		loop?: boolean | number;
		autoplay?: boolean;
		renderer?: RendererType;
		speed?: number;
		direction?: 1 | -1;
		class?: string;
		style?: string;
		ariaLabel?: string;
	}>();

	let container: HTMLDivElement | null = null;
	let anim: AnimationItem | null = null;

	onMount(async () => {
		if (!container) return;
		if (!path && !animationData) return;

		const mod = await import('lottie-web/build/player/lottie_light');
		const lottie = ((mod as unknown as { default?: unknown }).default ?? mod) as unknown as {
			loadAnimation: (params: {
				container: Element;
				renderer: RendererType;
				loop: boolean | number;
				autoplay: boolean;
				path?: string;
				animationData?: object;
				rendererSettings?: Record<string, unknown>;
			}) => AnimationItem;
		};

		anim = lottie.loadAnimation({
			container,
			renderer,
			loop,
			autoplay,
			path: animationData ? undefined : path,
			animationData: animationData ?? undefined,
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid meet'
			}
		});

		anim.setSpeed(speed);
		anim.setDirection(direction);
	});

	onDestroy(() => {
		anim?.destroy();
		anim = null;
	});
</script>

<div
	bind:this={container}
	class={`lottie-player ${className}`.trim()}
	{style}
	role="img"
	aria-label={ariaLabel}
></div>
