import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ getClientAddress}) => {
    const ip = getClientAddress()
    return new Response(JSON.stringify(ip), {headers: {
        'Content-type': 'application/json'
    }});
};