<script lang="ts">
	import ProfileCard from '$lib/components/ProfileCard.svelte';

	interface Project {
		link: string;
		iframe: string;
		image: string;
		title: string;
		description: string;
		hackclub?: boolean;
	}

	let { projects = [] }: { projects: Project[] } = $props();

	const hackclubProjects = $derived(projects.filter((p) => p.hackclub === true));

	// Duplicate projects multiple times for seamless infinite scroll
	const duplicatedProjects = $derived([
		...hackclubProjects,
		...hackclubProjects,
		...hackclubProjects
	]);
</script>

{#if hackclubProjects.length > 0}
	<div class="carousel-container">
		<div class="carousel-track">
			{#each duplicatedProjects as project}
				<a href={project.link} target="_blank" rel="noopener noreferrer" class="project-link">
					<ProfileCard>
						<img src={project.image} alt={project.title} class="project-image" />
						<h2 class="project-title">{project.title}</h2>
						<p class="project-description">{project.description}</p>
					</ProfileCard>
				</a>
			{/each}
		</div>
	</div>
{:else}
	<p class="text-white/60 text-center">No Hack Club projects to display</p>
{/if}

<style>
	.carousel-container {
		width: 100%;
		overflow: hidden;
		position: relative;
		padding: 2rem 0;
	}

	.carousel-track {
		display: flex;
		gap: 2rem;
		animation: scroll 40s linear infinite;
		width: fit-content;
	}

	.carousel-track:hover {
		animation-play-state: paused;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-100% / 3));
		}
	}

	.project-link {
		flex-shrink: 0;
		width: 400px;
		text-decoration: none;
		display: block;
		opacity: 0.8;
		filter: brightness(0.5);
		transition: filter 200ms, opacity 200ms;
	}

	.project-link:hover {
		filter: brightness(1);
		opacity: 1;
	}

	.project-image {
		width: 100%;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.project-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 0.75rem;
	}

	.project-description {
		font-size: 1rem;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.project-link {
			width: 300px;
		}

		.carousel-track {
			gap: 1.5rem;
		}

		.project-title {
			font-size: 1.25rem;
		}

		.project-description {
			font-size: 0.875rem;
		}
	}
</style>