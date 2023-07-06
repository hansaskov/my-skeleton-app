import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
	schema: './src/lib/schemas/drizzle/*',
	out: './drizzle',
	driver: 'mysql2',
	dbCredentials: {
		connectionString: process.env.PLANETSCALE_URL!
	}
} satisfies Config;
