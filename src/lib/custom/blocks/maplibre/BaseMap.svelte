<script lang="ts">
	import {
		MapLibre,
		Marker,
		ScaleControl,
		GlobeControl,
		FullScreenControl,
		Popup
	} from 'svelte-maplibre-gl';
	let popupOpen = $state(false);

	let offset = $state(24);

	let offsets: maplibregl.Offset = $derived({
		top: [0, offset],
		bottom: [0, -offset],
		left: [offset + 12, 0],
		right: [-offset - 12, 0],
		center: [0, 0],
		'top-left': [offset, offset],
		'top-right': [-offset, offset],
		'bottom-left': [offset, -offset],
		'bottom-right': [-offset, -offset]
	});
</script>

<MapLibre
	zoom={12}
	center={[36.79, -1.295]}
	class="h-[400px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
>
	<ScaleControl />
	<GlobeControl />
	<Marker lnglat={[36.78990045770398, -1.2944866822436203]}>
		<Popup class="text-black" bind:open={popupOpen} offset={offsets}>
			<span class="text-lg">Intuitive Insights</span>
		</Popup>
	</Marker>
	<FullScreenControl position="top-left" />
</MapLibre>
