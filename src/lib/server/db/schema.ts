import { pgTable, text, timestamp, integer, primaryKey, index, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	firstName: text('first_name'),
	lastName: text('last_name'),
	email: text('email').unique().notNull(),
	emailVerified: timestamp('email_verified', { mode: 'date' }),
	image: text('image'),
	password: text('password'),
	phone: text('phone'),
	bio: text('bio'),
	location: text('location'),
	active: boolean('active').default(true).notNull(),
	role: text('role').default('user').notNull(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow()
});

export const accounts = pgTable(
	'accounts',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const sessions = pgTable(
	'sessions',
	{
		sessionToken: text('session_token').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(table) => ({
		userIdIdx: index('sessions_user_id_idx').on(table.userId)
	})
);

export const verificationTokens = pgTable(
	'verification_tokens',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
		identifierIdx: index('vt_identifier_idx').on(vt.identifier)
	})
);
