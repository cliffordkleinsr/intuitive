import type { PageServerLoad } from './$types';
import capitals from '$lib/geojson/world-capitals.json';
import type { GeometryCollection, Topology } from 'topojson-specification';
export const load = (async () => {
	const worldres = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const world = (await worldres.json()) as Topology<{
		countries: GeometryCollection<{ name: string }>;
		land: GeometryCollection;
	}>;

	return {
		world,
		capitals
	};
}) satisfies PageServerLoad;
