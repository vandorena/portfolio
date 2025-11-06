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
<section class="min-h-screen flex items-center justify-center relative z-10">
  <div class="prose prose-invert text-center">
    <ProfileCard padding="0.5rem">
      <img src="/happyme.webp" alt="Alex Van Doren Sailing" class="w-32 sm:w-40 md:w-90 rounded-xl"/>
    </ProfileCard>

    <div class="flex items-center justify-center gap-3 mt-4">
      <h1 class="mb-0">Sailing</h1>
      <a href="https://www.instagram.com/alex.van.doren/" target="_blank" rel="noopener noreferrer" class="hover:scale-105">
        <img src="/Instagram_Glyph_White.png" alt="Instagram" class="w-8 h-8"/>
      </a>
    </div>
    <p>I love sailing! It's my favourite thing to do!</p>
    <h2>Results</h2>
    <h3>ILCA 6</h3>
    <h3>Topper</h3>
    <ul>
      <li>2023 Topper World Championships: 20th</li>
      <li>2022 Topper National Championships: 45th</li>
    </ul>
  </div>
</section>

<style>
	@media (min-width: 768px) {
		:global(body) {
			overflow: hidden;
		}
	}
</style>
