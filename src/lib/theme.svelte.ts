let dark = $state(false);

export const theme = {
	get dark() {
		return dark;
	},
	init() {
		if (typeof document !== 'undefined') {
			dark = document.documentElement.classList.contains('dark');
		}
	},
	toggle() {
		if (typeof document === 'undefined') return;
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
};
