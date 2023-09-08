import type { PageServerLoad } from './$types';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import {
	selectFamiliesAndMembersForUser2,
	selectFamilyOnUser
} from '$lib/server/drizzle/family/select';

import { redirect } from 'sveltekit-flash-message/server';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { deleteFamilySchema, inviteFamilyMemberSchema } from '$lib/schemas/family';
import { sendFamilyInvite } from '$lib/server/drizzle/family/insert';
import { deleteFamily } from '$lib/server/drizzle/family/delete';
import type { Message } from '$lib/schemas/message';
import { DatabaseError } from '@planetscale/database';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();
	const { userInfo, user } = await redirectFromPrivatePage(session, event);
	const inviteFamilyMemberForm = await superValidate<typeof inviteFamilyMemberSchema, Message>(inviteFamilyMemberSchema);
	const deleteFamilyForm = await superValidate<typeof deleteFamilySchema, Message>(deleteFamilySchema);

	try {
		const families = await selectFamiliesAndMembersForUser2(user.userId);
		return { userInfo, user, families, inviteFamilyMemberForm, deleteFamilyForm };
	} catch (e) {
		console.error(e);
	}

	return { userInfo, user, inviteFamilyMemberForm, deleteFamilyForm };
};

export const actions = {
	inviteToFamily: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		const userId = session.user.userId;

		// Validate form
		const form = await superValidate<typeof inviteFamilyMemberSchema, Message>(event.request, inviteFamilyMemberSchema);
		if (!form.valid) return fail(400, { form });

		const familyId = form.data.familyId;
		const email = form.data.email;

		try {
			// Validate if user is autherized to do action
			const userRelation = await selectFamilyOnUser({ userId, familyId });
			if (!userRelation || userRelation.familyRole !== 'MODERATOR') 
			    return message(form, {type: 'error', text: 'You are not a moderator 🤓'});

			if (form.data.email === session.user.email)
				return message(form, {type: 'error', text: 'Invite declined, try inviting someone else 😉'})

			

			// Create new invite
			await sendFamilyInvite({ email, familyId, invitingUserId: userId });
		} catch (e) {
			if (e instanceof DatabaseError) {
				if (e.body.message.includes("code = AlreadyExists")){
					return message(form, {type: 'error', text: `You have already invited ${email} 🙄`})
				}
			}

			console.error(e);
			return message(form, {type: 'error', text: 'Unknown Error, try again 😔'});
		}

        return message(form, {type: 'success', text: `invite sent to ${email} 😎`})
	},

	deleteFamily: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		const userId = session.user.userId;

		// Validate form
		const form = await superValidate(event.request, deleteFamilySchema);
		if (!form.valid) return fail(400, { form });

		const familyId = form.data.familyId;

		try {
			// Validate if user is autherized to do action
			const userRelation = await selectFamilyOnUser({ userId, familyId });
			if (!userRelation || userRelation.familyRole !== 'MODERATOR')
				return setError(form, 'Not autherized to do action');

			// Delete famiily invite
			await deleteFamily({ familyId });
		} catch (e) {
			console.error(e);
			return setError(form, 'Unknown error');
		}
	}
};
