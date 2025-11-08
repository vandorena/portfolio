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
		<p class="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
			At Hack Club, I run You Ship We Ship (YSWS) programs that empower students to build and share their passion projects for prizes.
		</p>
	</div>

	<div class="w-full rotate-5">
		<ProjectCarousel projects={data.projects} />
	</div>
</div>
<style>
	@media (min-width: 768px) {
		:global(body) {
			overflow: hidden;
		}
	}
</style>