import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	// console.log('Initializing module')
	const fetchIndustry = async (name: string) => {
		const res = await fetch(`/api/industries/${name}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await res.json();
		return data;
	};

	return {
		industry: await fetchIndustry(params.industryName)
	};
};
