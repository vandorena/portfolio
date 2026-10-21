<script lang="ts">
	import { onMount } from 'svelte';
	import ProfileCard from '$lib/components/ProfileCard.svelte';

	onMount(async () => {
		// dynamic import so this only runs in the browser (avoids SSR issues)
		const mod = await import('$lib/tilt.js');
		const VanillaTilt = (mod && (mod.default ?? mod)) as any;

		const elements = document.querySelectorAll('[data-tilt]');
		if (elements.length && VanillaTilt && typeof VanillaTilt.init === 'function') {
			VanillaTilt.init(elements, {
				max: 15,
				speed: 400,
				glare: true,
				'max-glare': 0.3,
			});
		}
	});

</script>
<div class="overflow-container">
	<div class="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center relative z-10">
		<ProfileCard padding="0.5rem">
			<img src="/me.webp" alt="Alex Van Doren" class="w-32 sm:w-40 md:w-50 rounded-xl hover:cursor-crosshair"/>
		</ProfileCard>

		<div data-tilt class=" bg-neutral-950/20 py-10 px-6 rotate-1 cursor-crosshair mt-4">
			<h1 class="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
				I'm Alex Van Doren
			</h1>
			<h2 class="text-2xl md:text-4xl font-condensed text-white mb-6 text-center">I'm a student at Brown ('30)
				<br class="pt-5">and ex-engineer at Hack Club :D
			</h2>
		</div>
		<div class="prose prose-invert text-center mt-8 max-w-3xl mb-4 px-4 md:px-0">
			<p>
				Welcome to my personal website! <br> tl;dr: I'm 19, I love sailing, I immigrated to the US at 17, and I make really cool looking websites!
			</p>
		</div>
	</div>
</div>

<style>
	.overflow-container {
		position: relative;
		width: 100%;
		overflow-x: clip;
	}
</style>
