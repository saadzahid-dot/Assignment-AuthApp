import type { Session } from '@auth/core/types';

declare module '@auth/core/types' {
	interface User {
		role?: string;
		sessionToken?: string;
	}
}

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			role?: string;
		};
	}
}

declare global {
	namespace App {
		interface Locals {
			auth(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
