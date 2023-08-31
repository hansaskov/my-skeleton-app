import { z } from 'zod';

export const familySchema = z.object({
	name: z.string().trim().min(1).max(255),
	is_public: z.boolean().optional().default(true)
});

export const inviteFamilyMemberSchema = z.object({
	familyId: z.string().min(1),
	email: z.string().email().min(1)
});

export const deleteFamilySchema = z.object({
	familyId: z.string().min(1)
});

export const famiilyInviteDeclineSchema = z.object({
	familyId: z.string().min(1)
});

export const familyInviteAcceptSchema = z.object({
	inviteId: z.string().min(1)
});
