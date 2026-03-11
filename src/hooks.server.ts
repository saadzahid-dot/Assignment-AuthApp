import { handle as authHandle } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const protectedRoutes: Handle = async ({ event, resolve }) => {
	const protectedPaths = ['/dashboard', '/profile'];
	const adminPaths = ['/admin'];
	const isProtected = protectedPaths.some((path) => event.url.pathname.startsWith(path));
	const isAdmin = adminPaths.some((path) => event.url.pathname.startsWith(path));

	if (isProtected || isAdmin) {
		const session = await event.locals.auth();
		if (!session?.user) {
			throw redirect(303, '/login');
		}

		if (isAdmin && session.user.role !== 'admin') {
			throw redirect(303, '/dashboard');
		}
	}

	return resolve(event);
};

export const handle = sequence(authHandle, protectedRoutes);
