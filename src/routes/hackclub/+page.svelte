<script lang="ts">
	import ProjectCarousel from '$lib/components/ProjectCarousel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen flex flex-col items-center justify-center relative z-10 py-12">
	<div class="text-center mb-12 px-4">
		<h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
			Hack Club
		</h1>
		<p class="text-white/80 text-lg md:text-xl max-w-4xl mx-auto">
			At Hack Club, I run You Ship We Ship (YSWS) programs that empower students to build and share their passion projects for prizes.
		</p>
		<p class="text-white/80 text-lg md:text-xl max-w-4xl mx-auto">So far I've been responsible for Hack Clubbers spending over <span class="gradient-text">4000</span> hours on their passion projects.</p>
	</div>

	<div class="w-full rotate-5">
		<ProjectCarousel projects={data.projects} />
	</div>
</div>
<style>
	.gradient-text {
		font-weight: bold;
		font-size: 1.2em;
		background: linear-gradient(
			90deg,
			#ff05ba,
			#a855f7,
			#d40651,
			#ff474a,
			#ff05ba
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 3s ease infinite;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% center;
		}
		50% {
			background-position: 100% center;
		}
		100% {
			background-position: 0% center;
		}
	}

	@media (min-width: 768px) {
		:global(body) {
			overflow: hidden;
		}
	}
</style>