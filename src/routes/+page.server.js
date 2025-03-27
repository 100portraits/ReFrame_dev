import { VITE_OPENROUTER_API_KEY } from '$env/static/private';

export function load() {
  return {
    apiKey: VITE_OPENROUTER_API_KEY || ''
  };
} 