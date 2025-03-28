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
		kenya
		// subscription: { subtype }
	} = data;
	let subtype = 'Premium Business';

	$effect(() => {
		const words: Map<number, string> = new Map();
		for (const element of analytics) {
			if (element.question_type === 'Single') {
				element.answer_statistics.forEach((e, i) => {
					words.set(i, e.answer);
				});
			}
		}
	});
</script>

<Analytics
	{total_responses}
	geoObject={kenya}
	gender={gender_analytics}
	sector={sector_analytics}
	{analytics}
	county={county_analytics}
	{raw}
	{subtype}
/>
<!-- <MapTile /> -->
