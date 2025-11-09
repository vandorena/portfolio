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

<!-- Video Background -->
<video autoplay loop muted playsinline class="video-background" preload="auto" poster="/sailingfirst.png">
	<source src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/d4af2a1f14b1bdcf024e0c925f0e3b906d4ba35b_pxl_20240831_122517100.mp4" type="video/mp4" />
</video>

<section class="min-h-screen flex items-center justify-center relative z-10 px-2 md:px-0">
  	<div class="prose prose-sm md:prose-base prose-invert text-center bg-neutral-500/60 rounded-xl px-2 py-3 md:px-6 md:py-4 max-w-[95vw] md:max-w-prose">


      <div class="flex items-center justify-center gap-2 md:gap-3 mt-2 md:mt-4">
        <h1 class="mb-0 text-2xl md:text-4xl">Sailing</h1>
        <a href="https://www.instagram.com/alex.van.doren/" target="_blank" rel="noopener noreferrer" class="hover:scale-105">
          <img src="/Instagram_Glyph_White.png" alt="Instagram" class="w-6 h-6 md:w-8 md:h-8"/>
        </a>
      </div>
      <p class="text-white text-sm md:text-base">I love sailing! It's my favourite thing to do!</p>
	  <p class="text-white text-sm md:text-base">I see a future where sailing is both sustainable and accessible. That's why I'm an ambassador for <a href="https://www.cleansailors.org" class="font-bold text-blue-900 hover:cursor-pointer hover:scale-105 no-underline hover:text-blue-700 hover:underline">Clean Sailors</a>.</p>
	  <p class="text-white text-sm md:text-base">Check out my Insta!</p>
      <h2 class="text-xl md:text-3xl">Results</h2>
      <h3 class="text-lg md:text-2xl">ILCA 6</h3>
      <ul class="text-white text-xs md:text-base">
        <li>2025 ILCA 6 Youth European Championships: 238th</li>
        <li>2024 ILCA 6 Youth World Championships: 224th</li>
      </ul>
      <h3 class="text-lg md:text-2xl">Topper</h3>
      <ul class="text-white text-xs md:text-base">
        <li>2023 Topper World Championships: 20th</li>
        <li>2022 Topper National Championships: 45th</li>
      </ul>
  </div>
</section>

<style>
	.video-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		z-index: 0;
	}

	@media (min-width: 768px) {
		:global(body) {
			overflow: hidden;
		}
	}
</style>
