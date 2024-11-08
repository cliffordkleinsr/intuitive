<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let mapEl = $state<HTMLDivElement>();

	$effect(() => {
		const map = new maplibregl.Map({
			container: mapEl as HTMLDivElement,
			style: 'https://tiles.openfreemap.org/styles/bright',
			center: [37.39402185424785, -0.47],
			zoom: 5.5
		});
		map.on('load', () => {
			map.addSource('kenya', {
				type: 'geojson',
				data: '/src/lib/geojson/kenya-counties-simplified.geojson'
			});

			map.addLayer({
				id: 'Turkana',
				type: 'fill',
				source: 'kenya',
				layout: {},
				paint: {
					'fill-color': '#088',
					'fill-opacity': 0.8
				}
			});
		});
	});
</script>

<div class="h-[400px] w-auto" bind:this={mapEl}></div>
