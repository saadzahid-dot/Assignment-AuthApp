import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { validatePassword } from '$lib/server/validation';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const user = await db.query.users.findFirst({
		where: eq(users.id, session!.user!.id!)
	});

	return {
		session,
		user: {
			id: user?.id,
			name: user?.name,
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			image: user?.image,
			phone: user?.phone,
			bio: user?.bio,
			location: user?.location,
			active: user?.active ?? true,
			hasPassword: !!user?.password,
			createdAt: user?.createdAt?.toISOString() ?? null
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const formData = await request.formData();
		const firstName = (formData.get('firstName') as string)?.trim();
		const lastName = (formData.get('lastName') as string)?.trim();
		const phone = (formData.get('phone') as string)?.trim() || null;
		const bio = (formData.get('bio') as string)?.trim() || null;
		const location = (formData.get('location') as string)?.trim() || null;

		if (!firstName) {
			return fail(400, { error: 'First name is required.' });
		}

		if (phone && !/^\+?[\d\s\-()]{7,20}$/.test(phone)) {
			return fail(400, { error: 'Please enter a valid phone number.' });
		}

		if (bio && bio.length > 300) {
			return fail(400, { error: 'Bio must be 300 characters or less.' });
		}

		const fullName = lastName ? `${firstName} ${lastName}` : firstName;

		await db
			.update(users)
			.set({ firstName, lastName, name: fullName, phone, bio, location })
			.where(eq(users.id, session.user.id));

		return { profileSuccess: true };
	},

	toggleActive: async ({ locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const user = await db.query.users.findFirst({
			where: eq(users.id, session.user.id)
		});

		if (!user) {
			return fail(404, { error: 'User not found.' });
		}

		await db
			.update(users)
			.set({ active: !user.active })
			.where(eq(users.id, session.user.id));

		return { activeToggled: true, newStatus: !user.active };
	},

	changePassword: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		const user = await db.query.users.findFirst({
			where: eq(users.id, session.user.id)
		});

		if (!user) {
			return fail(404, { passwordError: 'User not found.' });
		}

		// If user has an existing password, verify current password
		if (user.password) {
			if (!currentPassword) {
				return fail(400, { passwordError: 'Current password is required.' });
			}
			const isValid = await bcrypt.compare(currentPassword, user.password);
			if (!isValid) {
				return fail(400, { passwordError: 'Current password is incorrect.' });
			}
		}

		const passwordError = validatePassword(newPassword);
		if (passwordError) {
			return fail(400, { passwordError });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'New passwords do not match.' });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, session.user.id));

		return { passwordSuccess: true };
	}
};
