import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionToken = cookies.get('authjs.session-token');

		if (sessionToken) {
			// Delete session from database
			await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
		}

		// Clear the session cookie
		cookies.delete('authjs.session-token', { path: '/' });

		throw redirect(303, '/?toast=logout');
	}
};
