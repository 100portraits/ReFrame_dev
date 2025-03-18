<script>
	import '../app.css';
	let { children } = $props();
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<Navbar />

{@render children()}
