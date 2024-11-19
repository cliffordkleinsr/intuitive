import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request}) => {
    const data = await request.json()
    console.log(data)
    return new Response(JSON.stringify(data), { status: 200 });
};