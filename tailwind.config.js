/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
			fontFamily: {
				"montserrat": ["Montserrat",'sans-serif']
			},
			backgroundImage: {
				'main': "url('../src/img/main-bg.jpg')",
			}
		},
  },
  plugins: [],
}

