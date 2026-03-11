<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let loading = $state(false);

	const token = $derived($page.url.searchParams.get('token') || '');
	const email = $derived($page.url.searchParams.get('email') || '');
</script>

<svelte:head>
	<title>Reset Password - AuthApp</title>
</svelte:head>

<div class="animate-slide-up flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
			<div class="flex justify-center mb-4">
				<div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
					<svg class="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
			</div>

			{#if !data.valid}
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Invalid or Expired Link</h2>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">This reset link is invalid or has expired.</p>
				<div class="mt-6 text-center">
					<a
						href="/forgot-password"
						class="inline-block bg-indigo-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
					>
						Request New Link
					</a>
				</div>
			{:else}
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Reset Password</h2>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
					Enter a new password for <span class="font-medium text-gray-700 dark:text-gray-300">{data.email}</span>
				</p>

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
					<input type="hidden" name="token" value={token} />
					<input type="hidden" name="email" value={email} />

					{#if form?.error}
						<div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-lg p-3 border border-red-200 dark:border-red-800">
							{form.error}
						</div>
					{/if}

					<div>
						<label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
						<input
							id="newPassword"
							name="newPassword"
							type="password"
							required
							minlength="8"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
							placeholder="At least 8 characters"
						/>
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							minlength="8"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
							placeholder="Repeat new password"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
					>
						{loading ? 'Resetting...' : 'Reset Password'}
					</button>
				</form>
			{/if}

			<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
				<a href="/login" class="text-indigo-600 font-medium hover:text-indigo-500">Back to Sign In</a>
			</p>
		</div>
	</div>
</div>
