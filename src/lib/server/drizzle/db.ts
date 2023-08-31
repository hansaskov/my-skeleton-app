import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { planetscale_connection } from '../planetscale';

import * as schema from './schema';

export const db = drizzle(planetscale_connection, { schema });
