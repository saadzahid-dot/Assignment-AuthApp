import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csp: {
			directives: {
				'img-src': ['self', 'https://lh3.googleusercontent.com', 'https://avatars.githubusercontent.com']
			}
		}
	}
};

export default config;
