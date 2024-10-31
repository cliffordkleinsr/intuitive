import { industries } from '$lib/server/endpoints';
export const GET = ({ params }) => {
	// const res = await fetch(`${industries}`)
	// const data = await res.json()
	// if (params) {
	//     const industry = industries.find((item) => item.id === params)
	//     return new Response(JSON.stringify(industry), {status: 200})
	// }
	return new Response(JSON.stringify(industries), { status: 200 });
};
