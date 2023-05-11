import { generateRandomString, type User } from 'lucia-auth';
import { db } from './db';

import { POSTMARK_CLIENT_SECRET } from '$env/static/private';

import postmark from 'postmark';
import { redirectTo } from './redirects';
import { ratelimit } from './ratelimiter';

const postmarkClient = new postmark.ServerClient(POSTMARK_CLIENT_SECRET);

const sendEmail = async (user: User, subject: string, content: string) => {
	const rateLimitAttempt = await ratelimit.email.limit(user.userId);
	if (!rateLimitAttempt.success) {
		const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
		const message = `Email already sent. Please check your inbox or try again in ${timeRemaining} seconds.`;
		throw new postmark.Errors.RateLimitExceededError(message, 429, 429);
	}

	const emailPromise = postmarkClient.sendEmail({
		From: 'hans@askov.dk',
		To: user.email,
		Subject: subject,
		TextBody: content
	});

	const dbPromise = db.email.create({
		data: {
			id: generateRandomString(8),
			subject,
			email_address: user.email,
			content,
			date_sent: new Date()
		}
	});

	await Promise.all([emailPromise, dbPromise]);
};

export const sendEmailVerificationEmail = async (
	user: User,
	verificationToken: string,
	redirectPath: string | null
) => {
	let verificationLink = `https://hjemmet.net/email/verification/${verificationToken}`;
	if (redirectPath) verificationLink = verificationLink + `?${redirectTo}=${redirectPath}`;
	const emailContent = `Please verify your email by clicking the link \n${verificationLink}`;
	return await sendEmail(user, 'Email verification', emailContent);
};

export const sendPasswordResetEmail = async (user: User, resetToken: string) => {
	const resetLink = `https://hjemmet.net/password/reset/${resetToken}`;
	const emailContent = `Please reset your password via the link below: \n ${resetLink}`;
	await sendEmail(user, 'Password reset', emailContent);
};
