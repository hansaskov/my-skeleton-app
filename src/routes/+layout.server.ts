export const load = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	const { pathname } = url;

	return {
		user,
		pathname
	};
};
