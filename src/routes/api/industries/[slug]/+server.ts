import { industries } from '$lib/server/endpoints';

export const GET = async ({ params }) => {
	const industry = industries.find((item) => item.industryName === params.slug);

	return new Response(JSON.stringify(industry), { status: 200 });
};
