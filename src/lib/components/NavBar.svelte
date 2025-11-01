<script lang="ts">
    import { onMount } from 'svelte';

    let menuOpen = $state(false);
    let currentImageIndex = $state(0);

    const images = ['profilecard1.png', 'profilecard2.png', 'profilecard3.png', 'profilecard4.png'];
    const currentBackgroundImage = $derived(`url('/${images[currentImageIndex]}')`);

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    onMount(() => {
        const interval = setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }, 250);

        return () => clearInterval(interval);
    });
</script>

<!-- Hamburger Menu Button (Mobile Only) -->
<button class="hamburger z-50 hover:cursor-pointer hover:scale-105" onclick={toggleMenu} aria-label="Toggle menu">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
</button>

<!-- Navigation Links -->
<nav class="navbar z-50" class:menu-open={menuOpen}>
    <a href="/" class="nav-button text-xl py-2 hover:scale-105 mr-4" style="background-image: {currentBackgroundImage};">About Me</a>
    <a href="/sailing" class="nav-button text-xl py-2 hover:scale-105 mr-4" style="background-image: {currentBackgroundImage};">Sailing</a>
    <a href="/hackclub" class="nav-button text-xl py-2 hover:scale-105 mr-4" style="background-image: {currentBackgroundImage};">Hack Club</a>
    <a href="/portfolio" class="nav-button text-xl py-2 hover:scale-105" style="background-image: {currentBackgroundImage};">Things I've Made</a>
</nav>

<style>
    .navbar {
        position: absolute;
        top: 1.25rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0;
    }

    .nav-button {
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
        text-shadow: 1px 1px 2px black;
        width: calc(200vw / 10);
        display: inline-block;
        text-align: center;
        padding: 0.5rem 1rem;
        text-decoration: none;
    }

    /* Hamburger menu button */
    .hamburger {
        position: fixed;
        top: 1.25rem;
        right: 1.25rem;
        display: none;
        flex-direction: column;
        gap: 0.25rem;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        padding: 0.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
        z-index: 100;
    }

    .hamburger-line {
        width: 1.5rem;
        height: 0.15rem;
        background-color: white;
        transition: all 0.3s ease;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }

        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            flex-direction: column;
            justify-content: center;
            background: rgba(0, 0, 0, 0.95);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .navbar.menu-open {
            transform: translateX(0);
        }

        .nav-button {
            width: 80%;
            max-width: 300px;
            margin: 0.5rem 0;
        }
    }
</style>