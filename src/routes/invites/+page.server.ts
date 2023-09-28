import {
	selectAllFamilyInvitesFromEmail,
	selectPendingFamilyInvitesFromUserId
} from '$lib/server/drizzle/invite/select';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { addUserToFamily } from '$lib/server/drizzle/family/insert';
import { deleteInvite, deleteInvitesFromFamilyWithEmail } from '$lib/server/drizzle/invite/delete';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();
	const { user } = await redirectFromPrivatePage(session, event);

	const [familyInvites, pendingInvites] = await Promise.all([
		selectAllFamilyInvitesFromEmail(user.email),
		selectPendingFamilyInvitesFromUserId(user.userId)
	]);

	return { familyInvites, pendingInvites };
};

export const actions = {
	accept: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		const { userId, email } = session.user;

		const formData = await event.request.formData();
		const familyId = formData.get('familyId')?.toString();

		if (!familyId) return { message: 'failed' };

		try {
			// Add user as a member of the family
			await addUserToFamily({ familyId, userId, familyRole: 'MEMBER' });
			// Remove all invites to join this family
			await deleteInvitesFromFamilyWithEmail({ email, familyId });
		} catch (e) {
			console.error(e);
		}

		console.log('Success decline');
		return { message: 'succesfully accepted' };
	},
	decline: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		const formData = await event.request.formData();
		const inviteId = formData.get('inviteId')?.toString();
		if (!inviteId) return { message: 'failed' };

		try {
			await deleteInvite(inviteId);
		} catch (e) {
			console.error(e);
		}

		console.log('Success decline');
		return { message: 'succesfully declined' };
	}
} satisfies Actions;
