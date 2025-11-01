<script lang="ts">
	import { onMount } from 'svelte';

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
<div class="min-h-screen flex flex-col items-center justify-center relative z-10">
	<div class="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
		<h1 data-tilt class="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
			I'm Alex Van Doren
		</h1>
		
	</div>
</div>
