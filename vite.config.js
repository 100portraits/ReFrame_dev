import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		target: 'esnext',
		rollupOptions: {
			// Externalize known problematic dependencies
			external: []
		}
	},
	ssr: {
		noExternal: ['firebase', '@firebase/*'],
		target: 'webworker'
	},
	define: {
		// Define required Node.js environment variables
		'process.env.NODE_DEBUG': 'false',
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
	},
	resolve: {
		// Ensure Node.js builtins are properly handled
		dedupe: ['svelte']
	}
});
