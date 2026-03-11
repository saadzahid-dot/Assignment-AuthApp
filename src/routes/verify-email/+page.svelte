<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Email Verification - AuthApp</title>
</svelte:head>

<div class="animate-slide-up flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
			{#if data.status === 'success'}
				<div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Your email address has been successfully verified.</p>
				<a
					href="/dashboard"
					class="mt-6 inline-block w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
				>
					Go to Dashboard
				</a>
			{:else if data.status === 'expired'}
				<div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Link Expired</h2>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">This verification link has expired. Please request a new one from your dashboard.</p>
				<a
					href="/dashboard"
					class="mt-6 inline-block w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
				>
					Go to Dashboard
				</a>
			{:else}
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Invalid Link</h2>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">This verification link is invalid. Please check your email for the correct link.</p>
				<a
					href="/"
					class="mt-6 inline-block w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
				>
					Go Home
				</a>
			{/if}
		</div>
	</div>
</div>
