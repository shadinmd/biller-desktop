/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.tsx"
	],
	theme: {
		extend: {
			colors: {
				"primary": "#3F488D",
				"custom-gray": "#A2A2A2",
				"custom-offwhite": "#F5F5F5",
				"custom-light-gray": "#67748E"
			},
		},
	},
	plugins: [],
}

