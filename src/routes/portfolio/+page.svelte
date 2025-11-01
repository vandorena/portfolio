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

<section class="min-h-screen py-20 px-8 relative z-10">
	<h1 class="text-5xl font-bold text-white text-center mb-12">
		Cool Things I've Made ٩(^ᗜ^)و
	</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
		<ProfileCard>
			<h2 class="text-2xl font-bold mb-4">Project One</h2>
			<p class="text-lg">An awesome project that does amazing things.</p>
		</ProfileCard>
	</div>
</section>
