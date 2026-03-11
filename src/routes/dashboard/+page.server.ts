import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, verificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '$lib/server/email';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	let emailVerified = false;
	let active = true;
	let userProfile = null as {
		phone: string | null;
		bio: string | null;
		location: string | null;
		role: string;
		createdAt: string | null;
	} | null;

	if (session?.user?.id) {
		const dbUser = await db.query.users.findFirst({
			where: eq(users.id, session.user.id)
		});
		emailVerified = !!dbUser?.emailVerified;
		active = dbUser?.active ?? true;
		if (dbUser) {
			userProfile = {
				phone: dbUser.phone,
				bio: dbUser.bio,
				location: dbUser.location,
				role: dbUser.role,
				createdAt: dbUser.createdAt?.toISOString() ?? null
			};
		}
	}

	return { session, emailVerified, active, userProfile };
};

export const actions: Actions = {
	resendVerification: async ({ locals, url }) => {
		const session = await locals.auth();
		if (!session?.user?.email) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const email = session.user.email;

		// Check if already verified
		const dbUser = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (dbUser?.emailVerified) {
			return fail(400, { error: 'Email is already verified.' });
		}

		// Remove existing verification tokens for this email
		await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

		// Generate new token
		const token = crypto.randomUUID();
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		await db.insert(verificationTokens).values({
			identifier: email,
			token,
			expires
		});

		try {
			await sendVerificationEmail(email, token, url.origin);
			return { verificationSent: true };
		} catch (e) {
			console.error('Failed to send verification email:', e);
			return fail(500, { error: 'Failed to send verification email. Please try again.' });
		}
	}
};
