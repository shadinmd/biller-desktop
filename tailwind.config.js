/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{tsx,jsx}"
	],
	theme: {
		extend: {
			colors: {
				"primary": "#3F488D",
				"custom-gray": "#A2A2A2",
				"custom-offwhite": "#F5F5F5"
			},
		},
	},
	plugins: [],
}

