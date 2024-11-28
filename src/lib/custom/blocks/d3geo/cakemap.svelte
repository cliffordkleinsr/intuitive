<script lang="ts">
	import { scaleQuantile } from 'd3-scale';
	import { schemeBlues, schemeOranges } from 'd3-scale-chromatic';
	import { geoMercator } from 'd3-geo';
	import { Chart, GeoPath, Legend, Svg, Tooltip } from 'layerchart';
	import { index } from 'd3-array';
	import type { FeatureCollection } from 'geojson';
	import { format } from '@layerstack/utils';

	interface LocAnalytics {
		county: string;
		value: number;
	}
	let {
		locale_analytics,
		geoObject
	}: { locale_analytics: LocAnalytics[]; geoObject: FeatureCollection } = $props();

	const population = locale_analytics.map((d) => {
		return {
			id: d.county.toUpperCase(),
			respondents: +d.value
		};
	});

	const populationByFips = index(population, (d) => d.id);
	let enrichedCountiesFeatures = $derived(
		geoObject.features.map((feature) => {
			return {
				...feature,
				properties: {
					...feature.properties,
					data: populationByFips.get(feature?.properties?.COUNTY_NAM as string)
				}
			};
		})
	);
	let colorScale = $derived(
		scaleQuantile<string, string>()
			.domain(population.map((d: any) => d.respondents))
			.range(schemeOranges[7])
	);
</script>

<Chart
	geo={{
		projection: geoMercator,
		fitGeojson: geoObject
	}}
	padding={{ top: 60 }}
	tooltip={{ raiseTarget: true }}
	let:tooltip
	let:transform
>
	{@const strokeWidth = 1 / transform.scale}
	<Svg>
		<g>
			{#each enrichedCountiesFeatures as feature}
				<GeoPath
					geojson={feature}
					{tooltip}
					fill={colorScale(feature.properties.data?.respondents ?? 0)}
					class="stroke-none hover:stroke-white"
					{strokeWidth}
				/>
			{/each}
		</g>
		<g class="labels pointer-events-none">
			{#each geoObject.features as feature}
				<GeoPath
					geojson={feature}
					{strokeWidth}
					class="pointer-events-none fill-none stroke-black/30"
				/>
			{/each}
		</g>
	</Svg>
	<Legend
		scale={colorScale}
		title="Respondents"
		tickFormat={(d) => format(d, 'metric', { maximumSignificantDigits: 2 })}
		class="absolute bottom-0 m-1 rounded bg-surface-100/80 px-2 py-1 backdrop-blur-sm"
	/>
	<Tooltip.Root let:data>
		{@const d = populationByFips.get(data.properties?.COUNTY_NAM)}
		<Tooltip.Header>
			{data.properties.COUNTY_NAM}
		</Tooltip.Header>
		<Tooltip.List>
			<Tooltip.Item
				label="Total Respondents"
				value={d?.respondents}
				format="integer"
				valueAlign="right"
			/>
		</Tooltip.List>
	</Tooltip.Root>
</Chart>
