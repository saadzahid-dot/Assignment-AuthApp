<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let resending = $state(false);

	const user = $derived(data.session?.user);
	const greeting = $derived(() => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	});

	const currentTime = $derived(() => {
		return new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	});
</script>

<svelte:head>
	<title>Dashboard - AuthApp</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Hero Welcome Banner -->
	<div class="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-black dark:via-blue-950 dark:to-black p-8 mb-8 shadow-xl">
		<!-- Decorative elements -->
		<div class="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl"></div>
		<div class="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-300/10 rounded-full blur-xl animate-float"></div>

		<div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<p class="text-blue-300 text-sm font-medium mb-1">{currentTime()}</p>
				<h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
					{greeting()}, {user?.name || 'User'}
				</h1>
				<p class="text-gray-400 text-sm max-w-md">
					Welcome back to your dashboard. Here's an overview of your account.
				</p>
			</div>
			<div class="flex-shrink-0">
				{#if user?.image}
					<img src={user.image} alt="Profile" class="w-20 h-20 rounded-2xl border-2 border-white/30 shadow-lg" />
				{:else}
					<div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
						{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Email Verification Alert -->
	{#if !data.emailVerified}
		<div class="animate-slide-up-delay-1 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
					<svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<div>
					<p class="text-sm font-semibold text-amber-800 dark:text-amber-300">Verify your email address</p>
					<p class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Check your inbox for a verification link or resend it now.</p>
				</div>
			</div>
			{#if form?.verificationSent}
				<span class="text-sm font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-4 py-2 rounded-xl flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					Verification email sent!
				</span>
			{:else if form?.error}
				<span class="text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-4 py-2 rounded-xl">{form.error}</span>
			{:else}
				<form
					method="POST"
					action="?/resendVerification"
					use:enhance={() => {
						resending = true;
						return async ({ update }) => {
							resending = false;
							await update();
						};
					}}
				>
					<button
						type="submit"
						disabled={resending}
						class="text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/60 px-5 py-2 rounded-xl transition-all disabled:opacity-50 hover:shadow-md"
					>
						{resending ? 'Sending...' : 'Send Verification Link'}
					</button>
				</form>
			{/if}
		</div>
	{/if}

	<!-- Stat Cards -->
	<div class="animate-slide-up-delay-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
		<!-- Account Status -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-4">
				<div class="w-12 h-12 bg-gradient-to-br {data.active ? 'from-emerald-400 to-green-500' : 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center shadow-lg {data.active ? 'shadow-green-500/20 group-hover:shadow-green-500/40' : 'shadow-gray-500/20 group-hover:shadow-gray-500/40'} transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if data.active}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
						{/if}
					</svg>
				</div>
				{#if data.active}
					<span class="flex h-3 w-3">
						<span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
					</span>
				{:else}
					<span class="relative inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
				{/if}
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
			<p class="text-xl font-bold {data.active ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} mt-1">{data.active ? 'Active' : 'Inactive'}</p>
			<div class="mt-3 w-full {data.active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'} rounded-full h-1.5">
				<div class="{data.active ? 'bg-green-500' : 'bg-gray-400'} h-1.5 rounded-full animate-progress" style="width: {data.active ? '100%' : '30%'}"></div>
			</div>
		</div>

		<!-- Email Status -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-4">
				{#if data.emailVerified}
					<div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
				{:else}
					<div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
				{/if}
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Email Status</p>
			{#if data.emailVerified}
				<p class="text-xl font-bold text-green-600 dark:text-green-400 mt-1">Verified</p>
			{:else}
				<p class="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">Not Verified</p>
			{/if}
			<div class="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
				<div class="{data.emailVerified ? 'bg-green-500' : 'bg-amber-500'} h-1.5 rounded-full animate-progress" style="width: {data.emailVerified ? '100%' : '50%'}"></div>
			</div>
		</div>

		<!-- Session Type -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<div class="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
					<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
					Secure
				</div>
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Session</p>
			<p class="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">Database</p>
			<div class="mt-3 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1.5">
				<div class="bg-blue-500 h-1.5 rounded-full animate-progress" style="width: 100%"></div>
			</div>
		</div>

		<!-- Auth Method -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</div>
				{#if user?.image}
					<span class="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">OAuth</span>
				{:else}
					<span class="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">Password</span>
				{/if}
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Auth Method</p>
			<p class="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">
				{user?.image ? 'OAuth' : 'Credentials'}
			</p>
			<div class="mt-3 w-full bg-orange-100 dark:bg-orange-900/30 rounded-full h-1.5">
				<div class="bg-orange-500 h-1.5 rounded-full animate-progress" style="width: 100%"></div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
		<!-- User Info Card -->
		<div class="animate-slide-up-delay-2 lg:col-span-2 glass-card rounded-2xl shadow-sm p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					Your Information
				</h2>
				<a href="/profile" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50">
					Edit
				</a>
			</div>

			<div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
				{#if user?.image}
					<img src={user.image} alt="Profile" class="w-24 h-24 rounded-2xl shadow-md border-2 border-white dark:border-gray-700 flex-shrink-0" />
				{:else}
					<div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0">
						{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
					</div>
				{/if}
				<div class="flex-1 text-center sm:text-left">
					<p class="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'No name set'}</p>
					<p class="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
					<div class="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
						{#if data.active}
							<span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
								<span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
								Active Account
							</span>
						{:else}
							<span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
								<span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
								Inactive
							</span>
						{/if}
						{#if data.emailVerified}
							<span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
								<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
								Verified
							</span>
						{/if}
						<span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
							{user?.image ? 'OAuth' : 'Credentials'}
						</span>
						{#if data.userProfile?.role === 'admin'}
							<span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
								<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
								Admin
							</span>
						{/if}
					</div>
				</div>
			</div>

			<!-- Profile Details Grid -->
			{#if data.userProfile}
				<div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{#if data.userProfile.phone}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
									<svg class="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
								</div>
								<div>
									<p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone</p>
									<p class="text-sm font-medium text-gray-700 dark:text-gray-300">{data.userProfile.phone}</p>
								</div>
							</div>
						{/if}
						{#if data.userProfile.location}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
									<svg class="w-4 h-4 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
								</div>
								<div>
									<p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Location</p>
									<p class="text-sm font-medium text-gray-700 dark:text-gray-300">{data.userProfile.location}</p>
								</div>
							</div>
						{/if}
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
							</div>
							<div>
								<p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role</p>
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{data.userProfile.role}</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
							</div>
							<div>
								<p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Member Since</p>
								<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
									{data.userProfile.createdAt ? new Date(data.userProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
								</p>
							</div>
						</div>
					</div>
					{#if data.userProfile.bio}
						<div class="mt-4 flex items-start gap-3">
							<div class="w-9 h-9 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
							</div>
							<div>
								<p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bio</p>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{data.userProfile.bio}</p>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div class="animate-slide-up-delay-3 glass-card rounded-2xl shadow-sm p-6">
			<h2 class="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
				<svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
				Quick Actions
			</h2>
			<div>
				<a
					href="/profile"
					class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group hover:shadow-md"
				>
					<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
						<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-semibold text-sm text-gray-900 dark:text-white">Update Profile</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Change your name and details</p>
					</div>
					<svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
				</a>

				{#if data.session?.user?.role === 'admin'}
					<a
						href="/admin"
						class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 transition-all group hover:shadow-md mt-5"
					>
						<div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/60 transition-colors">
							<svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm text-gray-900 dark:text-white">Admin Panel</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">Manage users and settings</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
					</a>
				{/if}

				<form method="POST" action="/logout" class="contents">
					<button
						type="submit"
						class="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all text-left group hover:shadow-md mt-5"
					>
						<div class="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
							<svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-sm text-gray-900 dark:text-white">Sign Out</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">End your current session</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
