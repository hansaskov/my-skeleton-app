import { Errors } from 'postmark';
import { ratelimit } from '../ratelimit/ratelimiter';
import { postmarkClient } from '../postmark';
import type { User } from 'lucia';
import { dev } from '$app/environment';
import { generateEmailVerificationToken } from '../token';

const sendEmail = async (user: User, subject: string, content: string) => {
	await postmarkClient.sendEmail({
		From: 'hans@askov.dk',
		To: user.email,
		Subject: subject,
		TextBody: content
	});
};

const domain = dev ? 'http://localhost:5173' : 'https://hjemmet.net';

export const sendVerificationEmail = async (user: User) => {
	const verificationToken = await generateEmailVerificationToken(user.userId);
	const rateLimitAttempt = await ratelimit.email.verification.limit(user.userId);
	if (!rateLimitAttempt.success) {
		const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
		const message = `Email already sent. Please check your inbox or try again in ${timeRemaining} seconds.`;
		throw new Errors.RateLimitExceededError(message, 429, 429);
	}

	const verificationLink = `${domain}/email/verification/${verificationToken}`;
	const emailContent = `Please verify your email by clicking the link \n${verificationLink}`;
	return await sendEmail(user, 'Email verification', emailContent);
};

export const sendPasswordResetEmail = async (user: User, resetToken: string) => {
	const rateLimitAttempt = await ratelimit.email.password.limit(user.userId);
	if (!rateLimitAttempt.success) {
		const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
		const message = `Email already sent. Please check your inbox or try again in ${timeRemaining} seconds.`;
		throw new Errors.RateLimitExceededError(message, 429, 429);
	}

	const resetLink = `${domain}/password/reset/${resetToken}`;
	const emailContent = `Please reset your password via the link below: \n ${resetLink}`;
	await sendEmail(user, 'Password reset', emailContent);
};
