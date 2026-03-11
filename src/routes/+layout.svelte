<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';
	import { theme } from '$lib/theme.svelte';

	import type { Snippet } from 'svelte';

	let { data, children } = $props<{ data: LayoutData; children: Snippet }>();

	let toast = $state<{ message: string; type: 'success' | 'info' } | null>(null);
	let toastLeaving = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout>;
	let toastLeaveTimeout: ReturnType<typeof setTimeout>;

	function showToast(message: string, type: 'success' | 'info' = 'success') {
		clearTimeout(toastTimeout);
		clearTimeout(toastLeaveTimeout);
		toastLeaving = false;
		toast = { message, type };
		toastTimeout = setTimeout(() => {
			dismissToast();
		}, 3000);
	}

	function dismissToast() {
		toastLeaving = true;
		toastLeaveTimeout = setTimeout(() => {
			toast = null;
			toastLeaving = false;
		}, 300);
	}

	$effect(() => {
		theme.init();
	});

	$effect(() => {
		const t = $page.url.searchParams.get('toast');
		if (t === 'login') {
			showToast('Signed in successfully!');
			goto($page.url.pathname, { replaceState: true });
		} else if (t === 'logout') {
			showToast('Signed out successfully!');
			goto($page.url.pathname, { replaceState: true });
		} else if (t === 'register') {
			showToast('Account created successfully!');
			goto($page.url.pathname, { replaceState: true });
		}

	});
</script>

<div class="min-h-screen bg-amber-50/40 dark:bg-gray-950">
	<nav class="sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-black dark:via-blue-950 dark:to-black shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
			<div class="flex items-center justify-between h-16">
				<!-- Left: Logo -->
				<div class="flex items-center">
					<a href="/" class="inline-flex items-center gap-2 text-xl font-bold text-white tracking-wide">
						<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
						AuthApp
					</a>
				</div>

				<!-- Center: Nav Links (always visible) -->
				<div class="hidden sm:flex sm:space-x-1 absolute left-1/2 -translate-x-1/2">
					<a href="/" class="inline-flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
						</svg>
						Home
					</a>
					<a href="/dashboard" class="inline-flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
						Dashboard
					</a>
					<a href="/profile" class="inline-flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Profile
					</a>
					{#if data.role === 'admin'}
						<a href="/admin" class="inline-flex items-center gap-1.5 text-orange-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Admin
						</a>
					{/if}
				</div>

				<!-- Right: Theme Toggle + User/Auth -->
				<div class="flex items-center space-x-3">
					<!-- Theme Toggle -->
					<button
						onclick={() => theme.toggle()}
						aria-label="Toggle dark mode"
						class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
					>
						{#if theme.dark}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
							</svg>
						{/if}
					</button>

					{#if data.session?.user}
						<div class="flex items-center space-x-3">
							{#if data.session.user.image}
								<img
									src={data.session.user.image}
									alt="Avatar"
									class="w-8 h-8 rounded-full ring-2 ring-white/30"
								/>
							{:else}
								<div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-medium ring-2 ring-white/30">
									{data.session.user.name?.[0]?.toUpperCase() || data.session.user.email?.[0]?.toUpperCase() || '?'}
								</div>
							{/if}
							<span class="text-sm text-gray-300 hidden sm:block">{data.session.user.name || data.session.user.email}</span>
						</div>
						<form method="POST" action="/logout">
							<button
								type="submit"
								class="text-sm text-gray-400 hover:text-white font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
							>
								Sign Out
							</button>
						</form>
					{:else}
						<a href="/login" class="text-sm text-gray-300 hover:text-white font-medium transition-colors">
							Sign In
						</a>
						<a
							href="/register"
							class="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
						>
							Sign Up
						</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<main>
		{@render children()}
	</main>
</div>

<!-- Toast Notification -->
{#if toast}
	<div class="fixed top-20 right-4 z-50 {toastLeaving ? 'animate-slide-out' : 'animate-slide-in'}">
		<div class="flex items-center gap-3 bg-amber-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700 shadow-lg rounded-xl px-5 py-3.5 min-w-[280px]">
			<div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
				<svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<p class="text-sm font-medium text-gray-900 dark:text-gray-100">{toast.message}</p>
			<button onclick={() => dismissToast()} aria-label="Dismiss notification" class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>
{/if}
