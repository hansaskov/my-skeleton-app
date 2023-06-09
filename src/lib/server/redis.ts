import { Redis} from '@upstash/redis';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';

export const kv = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});
