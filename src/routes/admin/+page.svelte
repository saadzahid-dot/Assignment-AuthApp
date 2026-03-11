<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let searchQuery = $state('');

	type User = PageData['users'][number];

	const filteredUsers = $derived(
		data.users.filter((user: User) => {
			if (!searchQuery) return true;
			const q = searchQuery.toLowerCase();
			return (
				user.name?.toLowerCase().includes(q) ||
				user.email.toLowerCase().includes(q) ||
				user.role?.toLowerCase().includes(q)
			);
		})
	);

	const verifiedCount = $derived(data.users.filter((u: User) => u.emailVerified).length);
	const adminCount = $derived(data.users.filter((u: User) => u.role === 'admin').length);
</script>

<svelte:head>
	<title>Admin Panel - AuthApp</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Admin Hero -->
	<div class="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 dark:from-black dark:via-gray-950 dark:to-blue-950 p-8 mb-8 shadow-xl">
		<div class="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
		<div class="absolute bottom-0 left-1/4 w-48 h-48 bg-orange-500/10 rounded-full -mb-12 blur-2xl"></div>
		<div class="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-float"></div>

		<div class="relative z-10">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
					<svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<span class="text-xs font-semibold uppercase tracking-wider text-orange-400">Admin Panel</span>
			</div>
			<h1 class="text-3xl sm:text-4xl font-bold text-white">
				Welcome, {data.session?.user?.name || data.session?.user?.email || 'Admin'}
			</h1>
			<p class="text-gray-400 text-sm mt-2">Manage users, roles, and monitor your application.</p>
		</div>
	</div>

	<!-- Alerts -->
	{#if form?.error}
		<div class="animate-scale-in mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-xl p-4 border border-red-200 dark:border-red-800 flex items-center gap-3">
			<div class="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
				<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
			</div>
			{form.error}
		</div>
	{/if}

	{#if form?.success}
		<div class="animate-scale-in mb-6 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-xl p-4 border border-green-200 dark:border-green-800 flex items-center gap-3">
			<div class="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
				<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
			</div>
			Action completed successfully.
		</div>
	{/if}

	<!-- Stats Grid -->
	<div class="animate-slide-up-delay-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
		<!-- Total Users -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-3">
				<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
			<p class="text-3xl font-bold text-gray-900 dark:text-white mt-1 animate-count">{data.stats.totalUsers}</p>
			<div class="mt-3 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1.5">
				<div class="bg-blue-500 h-1.5 rounded-full animate-progress" style="width: 100%"></div>
			</div>
		</div>

		<!-- Active Sessions -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-3">
				<div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<span class="flex h-3 w-3">
					<span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
				</span>
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</p>
			<p class="text-3xl font-bold text-gray-900 dark:text-white mt-1 animate-count">{data.stats.totalSessions}</p>
			<div class="mt-3 w-full bg-green-100 dark:bg-green-900/30 rounded-full h-1.5">
				<div class="bg-green-500 h-1.5 rounded-full animate-progress" style="width: {data.stats.totalUsers > 0 ? Math.min(100, (data.stats.totalSessions / data.stats.totalUsers) * 100) : 0}%"></div>
			</div>
		</div>

		<!-- Verified Users -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-3">
				<div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Verified Emails</p>
			<p class="text-3xl font-bold text-gray-900 dark:text-white mt-1 animate-count">{verifiedCount}</p>
			<div class="mt-3 w-full bg-cyan-100 dark:bg-cyan-900/30 rounded-full h-1.5">
				<div class="bg-cyan-500 h-1.5 rounded-full animate-progress" style="width: {data.stats.totalUsers > 0 ? (verifiedCount / data.stats.totalUsers) * 100 : 0}%"></div>
			</div>
		</div>

		<!-- Admin Users -->
		<div class="stat-card glass-card rounded-2xl shadow-sm p-6 group">
			<div class="flex items-center justify-between mb-3">
				<div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
			</div>
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</p>
			<p class="text-3xl font-bold text-gray-900 dark:text-white mt-1 animate-count">{adminCount}</p>
			<div class="mt-3 w-full bg-orange-100 dark:bg-orange-900/30 rounded-full h-1.5">
				<div class="bg-orange-500 h-1.5 rounded-full animate-progress" style="width: {data.stats.totalUsers > 0 ? (adminCount / data.stats.totalUsers) * 100 : 0}%"></div>
			</div>
		</div>
	</div>

	<!-- Users Table -->
	<div class="animate-slide-up-delay-2 glass-card rounded-2xl shadow-sm overflow-hidden">
		<div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
					<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<div>
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">All Users</h2>
					<p class="text-xs text-gray-500 dark:text-gray-400">{filteredUsers.length} of {data.users.length} users</p>
				</div>
			</div>
			<div class="relative">
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					placeholder="Search users..."
					bind:value={searchQuery}
					class="pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none w-full sm:w-64 transition-all"
				/>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-orange-50/50 dark:bg-gray-900/50">
					<tr>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Users</th>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verified</th>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
						<th class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
					{#each filteredUsers as user}
						<tr class="hover:bg-orange-50/50 dark:hover:bg-gray-700/30 transition-colors group">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center gap-3">
									{#if user.image}
										<img src={user.image} alt="{user.name || 'User'}" class="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700" />
									{:else}
										<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
											{user.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || '?'}
										</div>
									{/if}
									<div>
										<p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name || 'No name'}</p>
										<p class="text-xs text-gray-400 dark:text-gray-500 sm:hidden">{user.email}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{user.email}</td>
							<td class="px-6 py-4 whitespace-nowrap">
								{#if user.emailVerified}
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
										<span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
										Verified
									</span>
								{:else}
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
										<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
										Pending
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								{#if user.active}
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
										<span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
										Active
									</span>
								{:else}
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
										<span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
										Inactive
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								{#if user.role === 'admin'}
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
										<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
										Admin
									</span>
								{:else}
									<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
										<span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
										User
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right">
								<div class="flex items-center justify-end gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
									<form method="POST" action="?/toggleRole" use:enhance>
										<input type="hidden" name="userId" value={user.id} />
										<button
											type="submit"
											class="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
										>
											{user.role === 'admin' ? 'Demote' : 'Make Admin'}
										</button>
									</form>
									<form
										method="POST"
										action="?/deleteUser"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
											};
										}}
									>
										<input type="hidden" name="userId" value={user.id} />
										<button
											type="submit"
											class="text-xs font-semibold px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-all"
										>
											Delete
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}

					{#if filteredUsers.length === 0}
						<tr>
							<td colspan=7 class="px-6 py-12 text-center">
								<div class="flex flex-col items-center gap-3">
									<div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
										<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
									<p class="text-sm text-gray-500 dark:text-gray-400">No users found matching "{searchQuery}"</p>
									<button onclick={() => searchQuery = ''} class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">Clear search</button>
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
