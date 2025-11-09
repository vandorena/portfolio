<script lang="ts">
	import '../app.css';
	import ShaderBackground from '$lib/components/ShaderBackground.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/me.webp" />
</svelte:head>

<!-- Preload sailing video -->
<video preload="auto" style="display: none;">
	<source src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/d4af2a1f14b1bdcf024e0c925f0e3b906d4ba35b_pxl_20240831_122517100.mp4" type="video/mp4" />
</video>

<ShaderBackground/>
<NavBar/>
<div class="py-5">

</div>
{@render children?.()}
