import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { authorizedOrigins } from './config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: authorizedOrigins
	}
});
