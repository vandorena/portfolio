<script lang="ts">
    import { onMount } from 'svelte';

    let currentImageIndex = $state(0);

    const images = ['profilecard1.png', 'profilecard2.png', 'profilecard3.png', 'profilecard4.png'];
    const currentBackgroundImage = $derived(`url('/${images[currentImageIndex]}')`);

    let { children, padding = '2rem' } = $props();

    onMount(() => {
        const interval = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }, 250);

        return () => clearInterval(interval);
    });
</script>

<div
    class="profile-card"
    data-tilt
    style="background-image: {currentBackgroundImage}; padding: {padding};"
>
    {@render children?.()}
</div>

<style>
    .profile-card {
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
        text-shadow: 1px 1px 2px black;
        border-radius: 1rem;
        transition: all 0.3s ease;
    }

    .profile-card:hover {
        transform: scale(1.02);
    }
</style>