<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>AuthApp - Secure Authentication</title>
</svelte:head>

<!-- Hero Section -->
<div class="relative overflow-hidden">
	<!-- SVG pattern background wallpaper -->
	<div class="absolute inset-0 -z-20 opacity-[0.04] dark:opacity-[0.08]">
		<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<circle cx="20" cy="20" r="1.5" fill="#6366f1" />
				</pattern>
				<pattern id="diag" width="80" height="80" patternUnits="userSpaceOnUse">
					<path d="M0 80L80 0" stroke="#6366f1" stroke-width="0.5" fill="none" />
					<path d="M0 0L80 80" stroke="#6366f1" stroke-width="0.5" fill="none" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />
			<rect width="100%" height="100%" fill="url(#diag)" />
		</svg>
	</div>
	<!-- Gradient blobs -->
	<div class="absolute inset-0 -z-10">
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 rounded-full blur-3xl opacity-60 -translate-y-1/2"></div>
		<div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-blue-100 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-full blur-3xl opacity-40 translate-y-1/2"></div>
		<div class="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-pink-100 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-full blur-3xl opacity-30 -translate-x-1/2"></div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center py-20">

			<h1 class="animate-slide-up cursor-default text-5xl font-extrabold text-gray-900 dark:text-white sm:text-7xl tracking-tight">
				Secure <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Authentication</span>
			</h1>
			<p class="animate-slide-up-delay-1 cursor-default mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
				Protect your users with enterprise-grade security. Email sign-up, encrypted passwords,
				and persistent database sessions.
			</p>

			<!-- Role Selection Cards -->
			<div class="animate-slide-up-delay-2 mt-12 w-full max-w-2xl">
				<p class="text-sm text-gray-400 cursor-default dark:text-gray-500 mb-5 uppercase tracking-wider font-semibold">Select any to continue</p>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<!-- User Card -->
					<a
						href={data.session?.user && data.role === 'user' ? '/dashboard' : '/login?role=user'}
						class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-7 text-left transition-all hover:shadow-lg hover:-translate-y-1"
					>
						<div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 group-hover:scale-110 transition-transform">
							<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-gray-900 dark:text-white">Login as User</h3>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in or register as a regular user to access your personal dashboard.</p>
						<span class="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
							{data.session?.user && data.role === 'user' ? 'Go to Dashboard' : 'Login / Register'}
							<span class="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
						</span>
					</a>

					<!-- Admin Card -->
					<a
						href={data.session?.user && data.role === 'admin' ? '/admin' : '/login?role=admin'}
						class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 rounded-2xl p-7 text-left transition-all hover:shadow-lg hover:-translate-y-1"
					>
						<!-- <div class="absolute top-4 right-4">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">Admin</span>
						</div> -->
						<div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-200 dark:shadow-purple-900/40 group-hover:scale-110 transition-transform">
							<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-gray-900 dark:text-white">Login as Admin</h3>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in or register as an admin to manage all users and sessions.</p>
						<span class="mt-4 inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all">
							{data.session?.user && data.role === 'admin' ? 'Go to Admin Panel' : 'Login / Register'}
							<span class="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
						</span>
					</a>
				</div>
			</div>

			<!-- Feature Cards -->
			<div class="animate-slide-up-delay-3 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
				<!-- Card 1 -->
				<div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all hover:-translate-y-1 text-center flex flex-col items-center">
					<div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 group-hover:scale-110 transition-transform mx-auto">
						<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
					<p class="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">Register, log in, and manage your profile with ease. Full account lifecycle from sign-up to session management.</p>
				</div>

				<!-- Card 2 -->
				<div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all hover:-translate-y-1 text-center flex flex-col items-center">
					<div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-200 dark:shadow-purple-900/40 group-hover:scale-110 transition-transform mx-auto">
						<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 dark:text-white">Encrypted & Protected</h3>
					<p class="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">Passwords hashed with bcrypt, httpOnly cookies, and protected routes that keep unauthorized users out.</p>
				</div>

				<!-- Card 3 -->
				<div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-pink-200 dark:hover:border-pink-700 transition-all hover:-translate-y-1 text-center flex flex-col items-center">
					<div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-pink-200 dark:shadow-pink-900/40 group-hover:scale-110 transition-transform mx-auto">
						<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900 dark:text-white">Built for Speed</h3>
					<p class="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">Powered by SvelteKit for instant page transitions and Drizzle ORM for lightning-fast, type-safe database queries.</p>
				</div>
			</div>
		</div>
	</div>
</div>
