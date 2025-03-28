import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		target: 'esnext'
	},
	ssr: {
		noExternal: ['firebase', '@firebase/*'],
		target: 'webworker'
	},
	define: {
		'process.env.NODE_DEBUG': 'false'
	}
});
