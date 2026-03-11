<script lang="ts">
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);

	const role = $derived($page.url.searchParams.get('role') || 'user');
	const isAdmin = $derived(role === 'admin');
</script>

<svelte:head>
	<title>{isAdmin ? 'Admin Sign In' : 'Sign In'} - AuthApp</title>
</svelte:head>

<div class="animate-slide-up flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
			<!-- Role Badge -->
			<div class="flex justify-center mb-4">
				{#if isAdmin}
					<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Admin Login
					</span>
				{:else}
					<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						User Login
					</span>
				{/if}
			</div>

			<h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome back</h2>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
				Sign in to your {isAdmin ? 'admin' : 'user'} account
			</p>

			<!-- OAuth Buttons -->
			<div class="mt-8 space-y-3">
				<button
					onclick={() => signIn('google', { callbackUrl: isAdmin ? '/admin?toast=login' : '/dashboard?toast=login' })}
					class="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
					</svg>
					Continue with Google
				</button>

				<button
					onclick={() => signIn('github', { callbackUrl: isAdmin ? '/admin?toast=login' : '/dashboard?toast=login' })}
					class="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-gray-600 rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					Continue with GitHub
				</button>
			</div>

			<div class="mt-6 flex items-center">
				<div class="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
				<span class="px-4 text-sm text-gray-400 dark:text-gray-500">or</span>
				<div class="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
			</div>

			<!-- Credentials Form -->
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="mt-6 space-y-4"
			>
				<input type="hidden" name="role" value={role} />

				{#if $page.url.searchParams.get('reset') === 'success'}
					<div class="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg p-3 border border-green-200 dark:border-green-800">
						Password reset successfully! Sign in with your new password.
					</div>
				{/if}

				{#if form?.error}
					<div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-lg p-3 border border-red-200 dark:border-red-800">
						{form.error}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
						<a href="/forgot-password" class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">Forgot password?</a>
					</div>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
						placeholder="Enter your password"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 {isAdmin ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}"
				>
					{loading ? 'Signing in...' : isAdmin ? 'Sign In as Admin' : 'Sign In'}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
				Don't have an account?
				<a href="/register?role={role}" class="{isAdmin ? 'text-purple-600 dark:text-purple-400 hover:text-purple-500' : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'} font-medium">Sign up</a>
			</p>

			<div class="mt-3 text-center">
				<a href="/" class="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">&larr; Switch role</a>
			</div>
		</div>
	</div>
</div>
