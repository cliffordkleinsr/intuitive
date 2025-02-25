import { db } from '$lib/server/db';
import { clientData, clientPackages } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getconsumerDetails } from '$lib/server/db/db_utils';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;
	const consumer = await getconsumerDetails(userid);

	return {
		consumer
	};
	// const [client_pack] = await db
	// 	.select({
	// 		packageid: clientPackages.packageid,
	// 		desc: clientPackages.packageDesc,
	// 		plan: sql<string>`
	//             CASE
	//                 WHEN ${clientData.typeid} = ${clientPackages.priceIdMn} THEN ${clientPackages.package_price_mn}
	//                 WHEN ${clientData.typeid} = ${clientPackages.priceIdYr} THEN ${clientPackages.package_price_yr}
	//                 ELSE '0'
	//             END
	//         `,
	// 		qns: clientPackages.max_questions,
	// 		surv: clientPackages.max_surv,
	// 		agents: clientPackages.max_agents,
	// 		count: clientData.county,
	// 		Phone: clientData.phone,
	// 		at: clientData.processed_at,
	// 		expiry: clientData.expires_at,
	// 		payment_status: clientData.payment_status
	// 	})
	// 	.from(clientData)
	// 	.leftJoin(clientPackages, sql`${clientPackages.packageid} = ${clientData.packageid}`)
	// 	.where(sql`${clientData.clientId} = ${locals.session?.userId}`);
	// return {
	// 	client_pack
	// };
};
