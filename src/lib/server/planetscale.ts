import { connect, type Config } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import { PLANETSCALE_HOST, PLANETSCALE_PASSWORD, PLANETSCALE_USERNAME } from '$env/static/private';

import {
	familiesOnUsers,
	family,
	key,
	session,
	user,
	userInfo,
	wish,
	wishlist,
	wishlistOnUsers
} from '$lib/schemas/drizzle/schema';

const config: Config = {
	host: PLANETSCALE_HOST,
	username: PLANETSCALE_USERNAME,
	password: PLANETSCALE_PASSWORD
};

// create the connection
export const ps_connection = connect(config);

export const db = drizzle(ps_connection, {
	schema: { key, session, user, userInfo, family, familiesOnUsers, wish, wishlist, wishlistOnUsers }
});
