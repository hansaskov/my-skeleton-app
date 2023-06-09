import { Ratelimit } from '@upstash/ratelimit';
import { kv } from './redis';

export const ratelimit = {
	auth: new Ratelimit({
		redis: kv,
		analytics: true,
		prefix: 'ratelimit:auth',
		limiter: Ratelimit.slidingWindow(5, '10s')
	}),
	email: {
		verification: new Ratelimit({
			redis: kv,
			analytics: true,
			prefix: 'ratelimit:email:verification',
			limiter: Ratelimit.slidingWindow(1, '60s')
		}),
		password: new Ratelimit({
			redis: kv,
			analytics: true,
			prefix: 'ratelimit:email:password',
			limiter: Ratelimit.slidingWindow(1, '60s')
		})
	}
};
