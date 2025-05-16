<script lang="ts">
	import '../app.css';
</script>

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
