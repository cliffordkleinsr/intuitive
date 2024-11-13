<script lang="ts">
	import { geoNaturalEarth1 } from 'd3-geo';
	import { feature } from 'topojson-client';
	import type { GeometryCollection, Topology } from 'topojson-specification';
	import { Chart, GeoPath, GeoPoint, Svg, Text } from 'layerchart';

	interface Capitals {
		label: string;
		latitude: number;
		longitude: number;
	}
	interface Vorno {
		world: Topology<{
			countries: GeometryCollection<{ name: string }>;
			land: GeometryCollection;
		}>;
		capitals: Capitals[];
	}
	let { world, capitals }: Vorno = $props();
	const countries = feature(world, world.objects.countries);
</script>

<Chart
	data={capitals}
	x="longitude"
	y="latitude"
	geo={{
		projection: geoNaturalEarth1,
		fitGeojson: countries
	}}
	tooltip={{ mode: 'voronoi' }}
	let:tooltip
>
	<Svg>
		<g class="states">
			{#each countries?.features as feature}
				<GeoPath
					geojson={feature}
					class="fill-surface-content/10 stroke-surface-100 hover:fill-surface-content/20"
					{tooltip}
				/>
			{/each}
		</g>
		<g class="points pointer-events-none">
			{#each capitals as capital}
				<GeoPoint
					lat={capital.latitude}
					long={capital.longitude}
					r="2"
					class="stroke-danger fill-black/50 dark:fill-white"
				/>

				{#if tooltip.data}
					<GeoPoint lat={tooltip.data.latitude} long={tooltip.data.longitude} spring>
						<circle r="4" class="fill-none stroke-primary/50" />
						<Text
							y="-6"
							value={tooltip.data.label}
							textAnchor="middle"
							class="stroke-surface-100 text-[8px] [stroke-width:2px]"
						/>
					</GeoPoint>
				{/if}
			{/each}
		</g>
	</Svg>

	<!-- <Tooltip.Root let:data>
        <Tooltip.Header>{data.name}</Tooltip.Header>
        <Tooltip.List>
          <Tooltip.Item label="Latitude" value={data.latitude} format="decimal" />
          <Tooltip.Item label="Longitude" value={data.longitude} format="decimal" />
        </Tooltip.List>
      </Tooltip.Root> -->
</Chart>
