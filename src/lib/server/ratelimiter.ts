import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';

export const kv = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

export const ratelimit = {
	auth: new Ratelimit({
		redis: kv,
		analytics: true,
		prefix: 'ratelimit:auth',
		limiter: Ratelimit.slidingWindow(5, '10s')
	}),
	email: new Ratelimit({
		redis: kv,
		analytics: true,
		prefix: 'ratelimit:email',
		limiter: Ratelimit.slidingWindow(1, '60s')
	})
};
