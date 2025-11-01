<script lang="ts">
	import { onMount } from 'svelte';
	import ProfileCard from '$lib/components/ProfileCard.svelte';

	let iframeUrl = $state<string | null>(null);
	let showModal = $state(false);

	function openIframe(url: string, event: MouseEvent) {
		event.preventDefault();
		iframeUrl = url;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		iframeUrl = null;
	}

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

			<a href="https://accelerate.hackclub.com" onclick={(e) => openIframe('https://accelerate.hackclub.com', e)}>
				<ProfileCard>
					<img src="/accelerate-screenie.png" alt="Screenshot of Accelerate" class="mb-4 rounded-lg shadow-lg" />
					<h2 class="text-2xl font-bold mb-4">Accelerate</h2>
					<p class="text-lg">My best website yet. (The coolest Hack Club YSWS)</p>
				</ProfileCard>
			</a>

	</div>
</section>

<!-- iframe Modal -->
{#if showModal && iframeUrl}
	<div class="iframe-modal" onclick={closeModal}>
		<div class="iframe-container" onclick={(e) => e.stopPropagation()}>
			<button class="close-button" onclick={closeModal} aria-label="Close modal">
				✕
			</button>
			<iframe src={iframeUrl} title="Project Preview" class="project-iframe"></iframe>
		</div>
	</div>
{/if}

<style>
	.iframe-modal {
		position: fixed;
		top: -20px;
		left: 0;
		width: 100vw;
		height: 103vh;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.iframe-container {
		position: relative;
		width: 100%;
	height: 90%;
	background: white;
	border-radius: 0;
	overflow: hidden;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 3rem;
		height: 3rem;
		background: rgba(0, 0, 0, 0.08);
		color: white;
		border: none;
		border-radius: 0%;
		font-size: 1.5rem;
		cursor: pointer;
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: rgba(193, 14, 145, 0.628);
		transform: scale(1.1);
	}

	.project-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
