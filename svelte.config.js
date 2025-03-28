import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// Use compatibility date to ensure compatibility with Cloudflare
			compatibilityDate: '2023-10-30'
		}),
		// Provide clear environment detection
		env: {
			publicPrefix: 'VITE_'
		}
	},
	// Add compiler options for Svelte 5
	compilerOptions: {
		runes: true
	}
};

export default config;
