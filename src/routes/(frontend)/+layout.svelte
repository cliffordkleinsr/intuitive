<script lang="ts">
	import Footer from '$lib/custom/homecomponents/footer.svelte';
	import Navbar from '$lib/custom/homecomponents/Navbar.svelte';
	let { children } = $props();
</script>

<Navbar />
{@render children?.()}
<Footer />
