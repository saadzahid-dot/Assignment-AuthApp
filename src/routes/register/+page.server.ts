import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users, sessions, verificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '$lib/server/email';
import { validatePassword } from '$lib/server/validation';

const isProduction = process.env.NODE_ENV === 'production';

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const firstName = (formData.get('firstName') as string)?.trim();
		const lastName = (formData.get('lastName') as string)?.trim();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const role = (formData.get('role') as string) || 'user';

		if (!firstName || !email || !password || !confirmPassword) {
			return fail(400, { error: 'First name, email, and password are required.' });
		}

		if (firstName.length > 50 || (lastName && lastName.length > 50)) {
			return fail(400, { error: 'Name must be 50 characters or less.' });
		}

		const name = lastName ? `${firstName} ${lastName}` : firstName;

		const passwordError = validatePassword(password);
		if (passwordError) {
			return fail(400, { error: passwordError });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		// Validate role
		const validRole = role === 'admin' ? 'admin' : 'user';

		// Check if user already exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (existingUser) {
			return fail(400, { error: 'An account with this email already exists.' });
		}

		// Hash password and create user with selected role
		const hashedPassword = await bcrypt.hash(password, 12);

		const [newUser] = await db
			.insert(users)
			.values({
				name,
				firstName,
				lastName: lastName || null,
				email,
				password: hashedPassword,
				role: validRole
			})
			.returning();

		// Create database session
		const sessionToken = crypto.randomUUID();
		const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

		await db.insert(sessions).values({
			sessionToken,
			userId: newUser.id,
			expires
		});

		cookies.set('authjs.session-token', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: isProduction,
			maxAge: 30 * 24 * 60 * 60
		});

		// Generate email verification token
		const verificationToken = crypto.randomUUID();
		const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		await db.insert(verificationTokens).values({
			identifier: email,
			token: verificationToken,
			expires: tokenExpires
		});

		// Send verification email
		try {
			await sendVerificationEmail(email, verificationToken, url.origin);
		} catch (e) {
			console.error('Failed to send verification email:', e);
		}

		throw redirect(303, validRole === 'admin' ? '/admin?toast=register' : '/dashboard?toast=register');
	}
};
