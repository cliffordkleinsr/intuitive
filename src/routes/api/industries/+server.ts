import { industries } from '$lib/server/endpoints';
export const GET = () => {
	return new Response(JSON.stringify(industries), { status: 200 });
};
