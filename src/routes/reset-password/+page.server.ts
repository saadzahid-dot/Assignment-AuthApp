import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, verificationTokens } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { validatePassword } from '$lib/server/validation';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const email = url.searchParams.get('email');

	if (!token || !email) {
		return { valid: false, email: null };
	}

	const record = await db.query.verificationTokens.findFirst({
		where: and(
			eq(verificationTokens.identifier, email),
			eq(verificationTokens.token, token)
		)
	});

	if (!record || record.expires < new Date()) {
		return { valid: false, email: null };
	}

	return { valid: true, email };
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const token = formData.get('token') as string;
		const email = formData.get('email') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!token || !email) {
			return fail(400, { error: 'Invalid reset link.' });
		}

		// Verify token
		const record = await db.query.verificationTokens.findFirst({
			where: and(
				eq(verificationTokens.identifier, email),
				eq(verificationTokens.token, token)
			)
		});

		if (!record || record.expires < new Date()) {
			return fail(400, { error: 'Reset link has expired. Please request a new one.' });
		}

		const passwordError = validatePassword(newPassword);
		if (passwordError) {
			return fail(400, { error: passwordError });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		// Update password
		const hashedPassword = await bcrypt.hash(newPassword, 12);
		await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));

		// Delete used token
		await db.delete(verificationTokens).where(
			and(
				eq(verificationTokens.identifier, email),
				eq(verificationTokens.token, token)
			)
		);

		throw redirect(303, '/login?reset=success');
	}
};
