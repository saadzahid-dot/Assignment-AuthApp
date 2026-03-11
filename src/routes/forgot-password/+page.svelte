<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Forgot Password - AuthApp</title>
</svelte:head>

<div class="animate-slide-up flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
			<div class="flex justify-center mb-4">
				<div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
					<svg class="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
				</div>
			</div>

			<h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Forgot Password</h2>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Enter your email to receive a password reset link.</p>

			{#if form?.success}
				<div class="mt-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
					<p class="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Reset link sent!</p>
					<p class="text-xs text-green-600 dark:text-green-400">Check your email inbox for a link to reset your password. The link expires in 1 hour.</p>
				</div>
			{:else}
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
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
							placeholder="you@example.com"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
					>
						{loading ? 'Sending...' : 'Send Reset Link'}
					</button>
				</form>
			{/if}

			<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
				Remember your password?
				<a href="/login" class="text-indigo-600 font-medium hover:text-indigo-500">Sign in</a>
			</p>
		</div>
	</div>
</div>
