export const load = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();

	return {
		user
	};
};
