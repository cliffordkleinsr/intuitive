import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	preview: {
		port: 3000,
		host: true // This enables listening on all network interfaces
	},
	server: {
		// Also add this for development server
		host: true, // This enables listening on all network interfaces
		port: 3000
	}
});
