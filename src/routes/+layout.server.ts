import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	let hasSessions = false
	if (session)
		hasSessions = true

	return { hasSessions }
};



