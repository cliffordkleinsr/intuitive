import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const fetchService = async (name: string) => {
		const res = await fetch(`/api/services/${name}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await res.json();

		return data;
	};

	return {
		service: await fetchService(params.serviceName)
	};
};
