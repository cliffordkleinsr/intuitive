<script lang="ts">
	import Analytics from '$lib/custom/blocks/Analytics.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const {
		cumulative_analytics: { total_responses }
	} = data;
</script>

<Analytics {total_responses} />
<!-- <MapTile /> -->
