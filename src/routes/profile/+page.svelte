<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let profileLoading = $state(false);
	let passwordLoading = $state(false);
	let activeLoading = $state(false);
	let newPassword = $state('');

	let passwordChecks = $derived({
		length: newPassword.length >= 8,
		uppercase: /[A-Z]/.test(newPassword),
		lowercase: /[a-z]/.test(newPassword),
		number: /[0-9]/.test(newPassword)
	});
	let passwordStrength = $derived(
		(passwordChecks.length ? 1 : 0) + (passwordChecks.uppercase ? 1 : 0) + (passwordChecks.lowercase ? 1 : 0) + (passwordChecks.number ? 1 : 0)
	);

	function strengthColor(index: number) {
		if (index >= passwordStrength) return 'bg-gray-200 dark:bg-gray-700';
		if (passwordStrength <= 1) return 'bg-red-500';
		if (passwordStrength <= 2) return 'bg-orange-500';
		if (passwordStrength <= 3) return 'bg-yellow-500';
		return 'bg-green-500';
	}

	function strengthLabel() {
		if (newPassword.length === 0) return 'Min 8 chars';
		if (passwordStrength <= 1) return 'Weak';
		if (passwordStrength <= 2) return 'Fair';
		if (passwordStrength <= 3) return 'Good';
		return 'Strong';
	}
</script>

<svelte:head>
	<title>Profile - AuthApp</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Profile Hero -->
	<div class="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 dark:from-black dark:via-blue-950 dark:to-gray-950 mb-8 shadow-xl">
		<!-- Decorative blobs -->
		<div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full -mb-12 -ml-12 blur-2xl"></div>
		<div class="absolute top-1/3 right-1/3 w-20 h-20 bg-blue-300/10 rounded-full blur-xl animate-float"></div>

		<div class="relative z-10 px-8 pt-10 pb-20 flex flex-col items-center text-center">
			<h1 class="text-3xl font-bold text-white mb-1">Profile Settings</h1>
			<p class="text-blue-300 text-sm">Manage your account information and security</p>
		</div>
	</div>

	<!-- Profile Card (overlapping hero) -->
	<div class="animate-slide-up-delay-1 -mt-16 relative z-10 mx-auto max-w-sm mb-8">
		<div class="glass-card rounded-2xl shadow-lg p-6 text-center">
			<div class="flex justify-center -mt-14 mb-4">
				{#if data.user?.image}
					<img src={data.user.image} alt="Profile" class="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg" />
				{:else}
					<div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
						{data.user?.firstName?.[0]?.toUpperCase() || data.user?.name?.[0]?.toUpperCase() || data.user?.email?.[0]?.toUpperCase() || '?'}
					</div>
				{/if}
			</div>
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">
				{data.user?.name || 'No name set'}
			</h2>
			<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.user?.email}</p>
			{#if data.user?.bio}
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">{data.user.bio}</p>
			{/if}
			{#if data.user?.location || data.user?.phone}
				<div class="mt-2 flex items-center justify-center gap-3 text-xs text-gray-400 dark:text-gray-500">
					{#if data.user?.location}
						<span class="inline-flex items-center gap-1">
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
							{data.user.location}
						</span>
					{/if}
					{#if data.user?.phone}
						<span class="inline-flex items-center gap-1">
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
							{data.user.phone}
						</span>
					{/if}
				</div>
			{/if}
			<div class="mt-3 flex items-center justify-center gap-2">
				{#if data.user?.image}
					<span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
						OAuth Connected
					</span>
				{:else}
					<span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
						Email & Password
					</span>
				{/if}
			</div>
			<p class="text-xs text-gray-400 dark:text-gray-500 mt-3">
				{#if data.user?.image}
					Profile picture managed by your OAuth provider
				{:else}
					Profile pictures are available via Google or GitHub sign-in
				{/if}
			</p>
		</div>
	</div>

	<!-- Personal Information Form -->
	<div class="animate-slide-up-delay-2 glass-card rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
				<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			</div>
			<div>
				<h2 class="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
				<p class="text-xs text-gray-500 dark:text-gray-400">Update your name and personal details</p>
			</div>
		</div>

		{#if form?.profileSuccess}
			<div class="mb-5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-xl p-4 border border-green-200 dark:border-green-800 flex items-center gap-3">
				<div class="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
				</div>
				Profile updated successfully!
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-xl p-4 border border-red-200 dark:border-red-800 flex items-center gap-3">
				<div class="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</div>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateProfile"
			use:enhance={() => {
				profileLoading = true;
				return async ({ update }) => {
					profileLoading = false;
					await update();
				};
			}}
			class="space-y-5"
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<label for="firstName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
					<input
						id="firstName"
						name="firstName"
						type="text"
						value={data.user?.firstName ?? data.user?.name?.split(' ')[0] ?? ''}
						required
						class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
						placeholder="John"
					/>
				</div>
				<div>
					<label for="lastName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
					<input
						id="lastName"
						name="lastName"
						type="text"
						value={data.user?.lastName ?? data.user?.name?.split(' ').slice(1).join(' ') ?? ''}
						class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
						placeholder="Doe"
					/>
				</div>
			</div>

			<div>
				<label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
				<div class="relative">
					<input
						id="email"
						type="email"
						value={data.user?.email ?? ''}
						disabled
						class="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-orange-50/50 dark:bg-gray-900/50 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed pr-10"
					/>
					<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
					</div>
				</div>
				<p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Email cannot be changed for security reasons.</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<label for="phone" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						value={data.user?.phone ?? ''}
						class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
						placeholder="+92"
					/>
				</div>
				<div>
					<label for="location" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
					<input
						id="location"
						name="location"
						type="text"
						value={data.user?.location ?? ''}
						class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
						placeholder="Pakistan"
					/>
				</div>
			</div>

			<div>
				<label for="bio" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
				<textarea
					id="bio"
					name="bio"
					rows="3"
					maxlength="300"
					class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all resize-none"
					placeholder="Tell us a little about yourself..."
				>{data.user?.bio ?? ''}</textarea>
				<p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Max 300 characters.</p>
			</div>

			<div class="pt-1">
				<button
					type="submit"
					disabled={profileLoading}
					class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-8 py-3 text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
				>
					{#if profileLoading}
						<span class="flex items-center gap-2">
							<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
							Saving...
						</span>
					{:else}
						Save Changes
					{/if}
				</button>
			</div>
		</form>
	</div>

	<!-- Change Password -->
	<div class="animate-slide-up-delay-3 glass-card rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center">
				<svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>
			<div>
				<h2 class="text-lg font-bold text-gray-900 dark:text-white">Change Password</h2>
				<p class="text-xs text-gray-500 dark:text-gray-400">Update your password to keep your account secure</p>
			</div>
		</div>

		{#if form?.passwordSuccess}
			<div class="mb-5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-xl p-4 border border-green-200 dark:border-green-800 flex items-center gap-3">
				<div class="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
				</div>
				Password changed successfully!
			</div>
		{/if}

		{#if form?.passwordError}
			<div class="mb-5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-xl p-4 border border-red-200 dark:border-red-800 flex items-center gap-3">
				<div class="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</div>
				{form.passwordError}
			</div>
		{/if}

		<form
			method="POST"
			action="?/changePassword"
			use:enhance={() => {
				passwordLoading = true;
				return async ({ update }) => {
					passwordLoading = false;
					await update();
				};
			}}
			class="space-y-5"
		>
			{#if data.user?.hasPassword}
				<div>
					<label for="currentPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
					<input
						id="currentPassword"
						name="currentPassword"
						type="password"
						required
						class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
						placeholder="Enter current password"
					/>
				</div>
			{:else}
				<div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
					<div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
						<svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					</div>
					<p class="text-sm text-blue-700 dark:text-blue-300">
						You signed in via OAuth and don't have a password yet. Set one below to also enable email login.
					</p>
				</div>
			{/if}

			<div>
				<label for="newPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
				<input
					id="newPassword"
					name="newPassword"
					type="password"
					required
					minlength="8"
					bind:value={newPassword}
					class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
					placeholder="At least 8 characters"
				/>
				<div class="mt-2 flex items-center gap-4">
					<div class="flex-1 flex gap-1">
						<div class="h-1.5 flex-1 rounded-full transition-colors duration-300 {strengthColor(0)}"></div>
						<div class="h-1.5 flex-1 rounded-full transition-colors duration-300 {strengthColor(1)}"></div>
						<div class="h-1.5 flex-1 rounded-full transition-colors duration-300 {strengthColor(2)}"></div>
						<div class="h-1.5 flex-1 rounded-full transition-colors duration-300 {strengthColor(3)}"></div>
					</div>
					<span class="text-xs font-medium {passwordStrength === 4 ? 'text-green-500' : passwordStrength >= 3 ? 'text-yellow-500' : passwordStrength >= 1 ? 'text-orange-500' : 'text-gray-400'} transition-colors">{strengthLabel()}</span>
				</div>
				{#if newPassword.length > 0}
					<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1">
						<span class="text-xs {passwordChecks.length ? 'text-green-500' : 'text-gray-400'}">
							{passwordChecks.length ? '✓' : '○'} 8+ characters
						</span>
						<span class="text-xs {passwordChecks.uppercase ? 'text-green-500' : 'text-gray-400'}">
							{passwordChecks.uppercase ? '✓' : '○'} Uppercase
						</span>
						<span class="text-xs {passwordChecks.lowercase ? 'text-green-500' : 'text-gray-400'}">
							{passwordChecks.lowercase ? '✓' : '○'} Lowercase
						</span>
						<span class="text-xs {passwordChecks.number ? 'text-green-500' : 'text-gray-400'}">
							{passwordChecks.number ? '✓' : '○'} Number
						</span>
					</div>
				{/if}
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					required
					minlength="8"
					class="block w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-amber-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 transition-all"
					placeholder="Repeat new password"
				/>
			</div>

			<div class="pt-1">
				<button
					type="submit"
					disabled={passwordLoading}
					class="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-600 dark:to-gray-700 hover:from-gray-900 hover:to-black dark:hover:from-gray-500 dark:hover:to-gray-600 text-white rounded-xl px-8 py-3 text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-gray-900/20"
				>
					{#if passwordLoading}
						<span class="flex items-center gap-2">
							<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
							Updating...
						</span>
					{:else}
						{data.user?.hasPassword ? 'Change Password' : 'Set Password'}
					{/if}
				</button>
			</div>
		</form>
	</div>

	<!-- Account Status Toggle -->
	<div class="animate-slide-up-delay-4 glass-card rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 {data.user?.active ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-100 dark:bg-gray-700'} rounded-xl flex items-center justify-center transition-colors">
					{#if data.user?.active}
						<svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{:else}
						<svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
						</svg>
					{/if}
				</div>
				<div>
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">Account Status</h2>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{#if data.user?.active}
							Your account is currently <span class="text-green-600 dark:text-green-400 font-semibold">active</span>
						{:else}
							Your account is currently <span class="text-gray-500 dark:text-gray-400 font-semibold">inactive</span>
						{/if}
					</p>
				</div>
			</div>
			<form
				method="POST"
				action="?/toggleActive"
				use:enhance={() => {
					activeLoading = true;
					return async ({ update }) => {
						activeLoading = false;
						await update();
					};
				}}
			>
				<button
					type="submit"
					disabled={activeLoading}
					class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 {data.user?.active ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 dark:bg-gray-600 focus:ring-gray-400'}"
					aria-label="Toggle account status"
				>
					<span
						class="inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 {data.user?.active ? 'translate-x-6' : 'translate-x-1'}"
					></span>
				</button>
			</form>
		</div>
		{#if !data.user?.active}
			<div class="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
				<svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
				<p class="text-sm text-amber-700 dark:text-amber-300">
					Your account is set to inactive. Other users and admins will see you as inactive. Toggle the switch to reactivate.
				</p>
			</div>
		{/if}
	</div>

	<!-- Account Details -->
	<div class="animate-slide-up-delay-4 glass-card rounded-2xl shadow-sm p-6 sm:p-8">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
				<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<div>
				<h2 class="text-lg font-bold text-gray-900 dark:text-white">Account Details</h2>
				<p class="text-xs text-gray-500 dark:text-gray-400">Your account metadata and identifiers</p>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="bg-orange-50/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
				<p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">User ID</p>
				<p class="text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">{data.user?.id?.slice(0, 8)}...</p>
			</div>
			<div class="bg-orange-50/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
				<p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Member Since</p>
				<p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
					{data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
				</p>
			</div>
			<div class="bg-orange-50/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
				<p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Auth Method</p>
				<p class="text-sm font-semibold text-gray-700 dark:text-gray-300">{data.user?.image ? 'OAuth (Google/GitHub)' : 'Email & Password'}</p>
			</div>
		</div>
	</div>
</div>
