import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const isProduction = process.env.NODE_ENV === 'production';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const password = formData.get('password') as string;
		const role = (formData.get('role') as string) || 'user';

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (!user || !user.password) {
			return fail(400, { error: 'Invalid email or password.' });
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return fail(400, { error: 'Invalid email or password.' });
		}

		// Check if the user has the correct role
		if (role === 'admin' && user.role !== 'admin') {
			return fail(403, { error: 'This account does not have admin access.' });
		}

		if (role === 'user' && user.role !== 'user') {
			return fail(403, { error: 'This account is an admin account. Please use admin login.' });
		}

		// Create database session
		const sessionToken = crypto.randomUUID();
		const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

		await db.insert(sessions).values({
			sessionToken,
			userId: user.id,
			expires
		});

		cookies.set('authjs.session-token', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: isProduction,
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, role === 'admin' ? '/admin?toast=login' : '/dashboard?toast=login');
	}
};
