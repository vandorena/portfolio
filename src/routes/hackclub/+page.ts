import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import yaml from 'js-yaml';

interface Project {
	link: string;
	iframe: string;
	image: string;
	title: string;
	description: string;
	hackclub?: boolean;
}

interface ProjectsData {
	projects: Project[];
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/projects.yaml');
		if (!response.ok) {
			throw error(404, 'Projects file not found');
		}
		const yamlText = await response.text();
		const data = yaml.load(yamlText) as ProjectsData;

		return {
			projects: data.projects || []
		};
	} catch (err) {
		console.error('Error loading projects:', err);
		throw error(500, 'Failed to load projects');
	}
};