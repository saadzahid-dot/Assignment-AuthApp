import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, verificationTokens } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const email = url.searchParams.get('email');

	if (!token || !email) {
		return { status: 'invalid' as const };
	}

	// Verify the token
	const record = await db.query.verificationTokens.findFirst({
		where: and(
			eq(verificationTokens.identifier, email),
			eq(verificationTokens.token, token)
		)
	});

	if (!record || record.expires < new Date()) {
		return { status: 'expired' as const, email };
	}

	// Mark email as verified
	await db
		.update(users)
		.set({ emailVerified: new Date() })
		.where(eq(users.email, email));

	// Delete used token
	await db.delete(verificationTokens).where(
		and(
			eq(verificationTokens.identifier, email),
			eq(verificationTokens.token, token)
		)
	);

	return { status: 'success' as const };
};
