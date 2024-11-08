<script lang="ts">
	import Analytics from '$lib/custom/blocks/Analytics.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Analytics />
<!-- <MapTile /> -->
