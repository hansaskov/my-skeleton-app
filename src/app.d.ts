// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
		}
		interface PageData {
			flash?: {
				type: 'success' | 'error';
				message: string;
				page: string;
			};
		}
		// interface Locals {}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			email: string;
			email_verified: boolean;
			user_info_set: boolean;
		};
	}
}

// THIS IS IMPORTANT!!!
export {};
