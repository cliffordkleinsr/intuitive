import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const res = await fetch('https://dummyjson.com/quotes/random', {
		method: 'GET'
	});
	const data = await res.json();
	return {
		quote: data.quote,
		author: data.author
	};
};
