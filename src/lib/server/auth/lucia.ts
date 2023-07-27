import type { Auth } from 'lucia';
import type { AwaitedReturnType } from './utils';

export type LuciaUser<A extends Auth> = AwaitedReturnType<A['getUser']>;

export type CreateUserAttributesParameter<A extends Auth> = Parameters<
	A['createUser']
>[0]['attributes'];
