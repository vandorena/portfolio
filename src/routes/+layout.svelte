<script lang="ts">
	import '../app.css';
	import ShaderBackground from '$lib/components/ShaderBackground.svelte';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/me.webp" />
</svelte:head>
<ShaderBackground/>
<NavBar/>
<div class="py-5">

</div>
{@render children?.()}
