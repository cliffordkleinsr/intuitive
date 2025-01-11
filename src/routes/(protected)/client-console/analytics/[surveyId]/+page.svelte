<script lang="ts">
	import Analytics from '$lib/custom/blocks/Analytics.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const {
		cumulative_analytics: { total_responses },
		gender_analytics,
		sector_analytics,
		county_analytics,
		analytics,
		raw,
		subscription: { subtype }
	} = data;
</script>

<Analytics
	{total_responses}
	gender={gender_analytics}
	sector={sector_analytics}
	{analytics}
	county={county_analytics}
	{raw}
	{subtype}
/>
<!-- <MapTile /> -->
