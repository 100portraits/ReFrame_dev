<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="shortcut icon" href="/favicon.ico">
  <!-- Add other common meta tags if desired, e.g., theme-color from webmanifest -->
  <meta name="theme-color" content="#ffffff"> 
</svelte:head>

<slot />

<style>
	:global(html) {
		box-sizing: border-box;
	}
	
	:global(*, *:before, *:after) {
		box-sizing: inherit;
	}
	
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
