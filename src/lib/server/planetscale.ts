import { connect } from '@planetscale/database';
import { PLANETSCALE_HOST, PLANETSCALE_PASSWORD, PLANETSCALE_USERNAME } from '$env/static/private';

// create the connection
export const planetscale_connection = connect({
	host: PLANETSCALE_HOST,
	username: PLANETSCALE_USERNAME,
	password: PLANETSCALE_PASSWORD
});
