import { generateRandomString } from 'lucia-auth';
import { db } from './db';

import { POSTMARK_CLIENT_SECRET } from '$env/static/private';

import postmark from 'postmark';

const postmarkClient = new postmark.ServerClient(POSTMARK_CLIENT_SECRET);

const sendEmail = async (emailAddress: string, subject: string, content: string) => {
	postmarkClient.sendEmail({
		From: 'hans@askov.dk',
		To: emailAddress,
		Subject: subject,
		TextBody: content
	});

	await db.email.create({
		data: {
			id: generateRandomString(8),
			subject,
			email_address: emailAddress,
			content,
			date_sent: new Date()
		}
	});
};

export const sendEmailVerificationEmail = async (
	emailAddress: string,
	verificationToken: string
) => {
	const verificationLink = `https://hjemmet.net/email/verification/${verificationToken}`;
	const emailContent = `Please verify your email by clicking the link \n${verificationLink}`;
	await sendEmail(emailAddress, 'Email verification', emailContent);
};

export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
	const resetLink = `https://hjemmet.net/password/reset/${resetToken}`;
	const emailContent = `Please reset your password via the link below: \n ${resetLink}`;
	await sendEmail(emailAddress, 'Password reset', emailContent);
};
