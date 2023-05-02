import { generateRandomString } from 'lucia-auth';
import { prismaClient } from './db';

import postmark from 'postmark';

const postmarkClient = new postmark.ServerClient('ce1f7c37-aef3-4e8d-a747-60d49d13b500');

const sendEmail = async (emailAddress: string, subject: string, content: string) => {
	postmarkClient.sendEmail({
		From: 'hans@askov.dk',
		To: 'hans@askov.dk',
		Subject: subject,
		TextBody: content
	});

	await prismaClient.email.create({
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
	const verificationLink = `http://localhost:5173/email/verification/${verificationToken}`;
	const emailContent = `Please verify your email by clicking the link \n${verificationLink}`
	await sendEmail(emailAddress, 'Email verification', emailContent);
};

export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
	const resetLink = `http://localhost:5173/password-reset/${resetToken}`;
	const emailContent = `Please reset your password via the link below:
    
<a href="${resetLink}">${resetLink}</a>`;
	await sendEmail(emailAddress, 'Password reset', emailContent);
};
