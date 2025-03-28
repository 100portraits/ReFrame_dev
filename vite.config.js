import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		target: 'esnext'
	},
	ssr: {
		noExternal: ['firebase-admin', '@firebase/*', '@google-cloud/*'],
		target: 'node'
	},
	define: {
		'process.env.NODE_DEBUG': 'false',
		'global.process.env.NODE_DEBUG': 'false'
	}
});
