import { db } from '$lib/server/db';
import { utmSourceTracking } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UAParser } from 'ua-parser-js';

export const load = (async () => {
	// const total_devices = await db.select().from(utmSourceTracking)
	const device_types = await db
		.select({
			devices: utmSourceTracking.userAgent
		})
		.from(utmSourceTracking);

	const parsed = device_types.map((agent) => {
		const { browser: browserData, cpu, device, os } = UAParser(agent.devices as string);
		// const device = parser.getDevice();
		const uagent = agent.devices;
		const type = device.type || 'desktop';
		const browser = browserData.name;
		const aarch = cpu.architecture;
		const OSS = os.name;
		return { uagent, type, aarch, browser, OSS };
	});

	// console.log(parsed)
	return {
		parsed
	};
}) satisfies PageServerLoad;
