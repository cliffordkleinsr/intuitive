import { Redis } from 'ioredis';
import { env } from '$env/dynamic/private';
if (!env.ZEDIS_URI) throw new Error('ZEDIS_URI is not set');
export const redis = new Redis(env.ZEDIS_URI);