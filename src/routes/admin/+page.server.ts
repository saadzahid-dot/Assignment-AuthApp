import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allUsers = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			emailVerified: users.emailVerified,
			active: users.active,
			role: users.role,
			image: users.image,
			createdAt: users.createdAt
		})
		.from(users)
		.orderBy(desc(users.createdAt));

	const [{ value: totalUsers }] = await db.select({ value: count() }).from(users);
	const [{ value: totalSessions }] = await db.select({ value: count() }).from(sessions);

	return {
		users: allUsers.map((u) => ({
			...u,
			emailVerified: !!u.emailVerified,
			createdAt: u.createdAt?.toISOString() ?? null
		})),
		stats: {
			totalUsers,
			totalSessions
		}
	};
};

export const actions: Actions = {
	deleteUser: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) return fail(401, { error: 'Not authenticated.' });

		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) return fail(400, { error: 'User ID is required.' });
		if (userId === session.user.id) return fail(400, { error: 'You cannot delete yourself.' });

		await db.delete(sessions).where(eq(sessions.userId, userId));
		await db.delete(users).where(eq(users.id, userId));

		return { success: true };
	},

	toggleRole: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) return fail(401, { error: 'Not authenticated.' });

		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) return fail(400, { error: 'User ID is required.' });
		if (userId === session.user.id) return fail(400, { error: 'You cannot change your own role.' });

		const user = await db.query.users.findFirst({
			where: eq(users.id, userId)
		});

		if (!user) return fail(404, { error: 'User not found.' });

		const newRole = user.role === 'admin' ? 'user' : 'admin';
		await db.update(users).set({ role: newRole }).where(eq(users.id, userId));

		return { success: true };
	}
};
