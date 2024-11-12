<script lang="ts">
	import { counties } from '$lib/geojson/counties';
	import { geoMercator } from 'd3-geo';
	import { Canvas, Chart, GeoPath, Svg, Text } from 'layerchart';
</script>

<Chart
	geo={{
		projection: geoMercator,
		fitGeojson: counties
	}}
>
	<Svg>
		<g class="states">
			{#each counties.features as feature}
				<GeoPath
					geojson={feature}
					class="fill-surface-content/10 stroke-surface-100 hover:fill-surface-content/20"
				/>
			{/each}
		</g>
		<g class="labels pointer-events-none">
			{#each counties.features as feature}
				<GeoPath geojson={feature} let:geoPath>
					{@const [x, y] = geoPath.centroid(feature)}
					<Text
						{x}
						{y}
						value={feature?.properties?.COUNTY_NAM}
						textAnchor="middle"
						verticalAnchor="middle"
						class="stroke-surface-100 text-[8px] [stroke-width:2px]"
					/>
				</GeoPath>
			{/each}
		</g>
	</Svg>
</Chart>
