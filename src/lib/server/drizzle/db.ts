import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { planetscale_connection } from '../planetscale';

export const db = drizzle(planetscale_connection);
