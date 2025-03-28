// Custom Cloudflare worker that enables Node.js compatibility

export default {
  async fetch(request, env, ctx) {
    // This is needed to enable Node.js compatibility for Firebase
    // @ts-ignore
    const handler = await import('/.cloudflare/worker.js');
    
    // Apply all necessary compatibility flags
    globalThis.process = globalThis.process || {};
    globalThis.process.env = globalThis.process.env || {};
    
    // Forward the request to the SvelteKit handler
    return handler.default.fetch(request, env, ctx);
  }
}; 