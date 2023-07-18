import { connect, type Config } from '@planetscale/database';
import { PLANETSCALE_HOST, PLANETSCALE_PASSWORD, PLANETSCALE_USERNAME } from '$env/static/private';

const config: Config = {
	host: PLANETSCALE_HOST,
	username: PLANETSCALE_USERNAME,
	password: PLANETSCALE_PASSWORD
};

// create the connection
export const planetscale_connection = connect(config);
