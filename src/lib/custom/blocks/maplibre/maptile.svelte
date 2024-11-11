<script lang="ts">
	// Import MapLibre GL JS library and its styles
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	// Import GeoJSON data containing Kenya county boundaries and population data
	import { geojsonWithPopulation } from '$lib/geojson/kenya';

	// Declare reactive state variables for map and legend container elements
	let mapEl = $state<HTMLDivElement>();
	let legEl = $state<HTMLDivElement>();

	// Effect hook to initialize and manage the map
	$effect(() => {
		// Initialize MapLibre GL map with basic configuration
		const map = new maplibregl.Map({
			container: mapEl as HTMLDivElement,
			style: 'https://tiles.openfreemap.org/styles/positron', // Use OpenFreeMap positron style
			center: [37.845512390184695, -0.809831918408236], // Center on Kenya
			zoom: 6,
			pitch: 30, // Add a 3D perspective
			scrollZoom: true
		});

		// Once the map is loaded, add data layers and interactions
		map.on('load', () => {
			// Add Kenya GeoJSON as a data source
			map.addSource('kenya', {
				type: 'geojson',
				data: geojsonWithPopulation
			});

			// Add 3D extruded polygon layer for counties
			map.addLayer({
				id: 'kenya-fill',
				type: 'fill-extrusion',
				source: 'kenya',
				layout: {},
				paint: {
					'fill-extrusion-base': 0,
					// Color counties based on population using interpolated color scale
					'fill-extrusion-color': [
						'interpolate',
						['linear'],
						['get', 'population'],
						0,
						'#1a9850', // Lowest population (green)
						10000,
						'#91cf60', // Low population
						500000,
						'#d9ef8b', // Low-medium population
						1000000,
						'#fee08b', // Medium population
						2000000,
						'#fc8d59', // High population
						5000000,
						'#d73027' // Highest population (red)
					],
					'fill-extrusion-opacity': 0.6,
					// Set extrusion height based on population
					'fill-extrusion-height': [
						'interpolate',
						['linear'],
						['get', 'population'],
						1000,
						0, // Minimum height
						500000,
						20000, // Medium height
						4400000,
						200000 // Maximum height
					]
				}
			});

			// Initialize popup for county information
			const popup = new maplibregl.Popup({
				closeButton: false,
				closeOnClick: true
			});

			// Add click handler for county features
			map.on('click', 'kenya-fill', (e: any) => {
				if (!e.features?.length) {
					console.log('No features found');
					return;
				}

				map.getCanvas().style.cursor = 'pointer';

				if (e.features[0].geometry.type === 'Polygon') {
					const feature = e.features[0];
					const coordinates = e.features[0].geometry.coordinates[0][0].slice() as [number, number];
					const population = feature.properties.population.toLocaleString();
					const county = feature.properties.shapeName;

					// Ensure popup appears on the correct side of the dateline
					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}

					// Show popup with county information
					popup
						.setLngLat(coordinates)
						.setHTML(
							`
								<strong class="text-xl dark:text-black">${county}</strong>
								<p class="text-lg dark:text-black">
								Population (2019): ${population}
								</p>
							`
						)
						.addTo(map);
				}
			});

			// Add hover effects for better user interaction
			map.on('mouseenter', 'kenya-fill', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			map.on('mouseleave', 'kenya-fill', () => {
				map.getCanvas().style.cursor = '';
			});

			// Fit map to Kenya's bounds
			map.fitBounds([
				[32.958984, -5.353521],
				[43.50585, 5.615985]
			]);

			// Add fullscreen control
			map.addControl(new maplibregl.FullscreenControl());

			// Cleanup function to remove map and popup when component is destroyed
			return () => {
				popup.remove();
				map.remove();
			};
		});
	});
</script>

<!-- Map container with legend -->
<div class="h-[420px] w-auto rounded-sm" bind:this={mapEl}>
	<!-- Legend showing population ranges and corresponding colors -->
	<div
		class="legend box absolute bottom-0 right-0 z-50 mb-11 mr-4 rounded-sm bg-white p-1 shadow-sm dark:text-black"
		bind:this={legEl}
	>
		<h4>Population</h4>
		<div><span class="bg-[#723122]"></span>25,000,000</div>
		<div><span class="bg-[#8b4225]"></span>10,000,000</div>
		<div><span class="bg-[#a25626]"></span>7,500,000</div>
		<div><span class="bg-[#b86b25]"></span>5,000,000</div>
		<div><span class="bg-[#ca8323]"></span>2,500,000</div>
		<div><span class="bg-[#da9c20]"></span>1,000,000</div>
		<div><span class="bg-[#e6b71e]"></span>750,000</div>
		<div><span class="bg-[#eed322]"></span>500,000</div>
		<div><span class="bg-[#f2f12d]"></span>0</div>
	</div>
</div>

<!-- Styles for legend color indicators -->
<style>
	.legend div span {
		border-radius: 50%;
		display: inline-block;
		height: 10px;
		margin-right: 5px;
		width: 10px;
	}
</style>
