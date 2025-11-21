import type { Config } from 'tailwindcss';

const config = {
	// Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				// Additional tablet-specific breakpoints
				tablet: '768px',
				'tablet-lg': '1024px'
			},
			fontFamily: {
				fun: ['Mozilla Text', 'cursive'],
				sans: ['Mozilla Text', 'Inter', 'system-ui', 'sans-serif'], // Mozilla Text as default
				body: ['Inter', 'system-ui', 'sans-serif'] // Keep Inter for body text
			},
			colors: {
				// Custom color palette for your app
				primary: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981', // Main green
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
					950: '#022c22'
				},
				secondary: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316', // Main orange
					600: '#ea580c', // Burnt orange
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
					950: '#431407'
				},
				accent: {
					50: '#ecfeff',
					100: '#cffafe',
					200: '#a5f3fc',
					300: '#67e8f9',
					400: '#22d3ee',
					500: '#06b6d4', // Main cyan
					600: '#0891b2',
					700: '#0e7490',
					800: '#155e75',
					900: '#164e63',
					950: '#083344'
				},
				dark: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b', // Main dark background
					900: '#0f172a', // Darker background
					950: '#020617'
				}
			}
		}
	},
	plugins: []
} satisfies Config;

export default config;
