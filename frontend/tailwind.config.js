/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2D6A4F',
                'primary-light': '#52B788',
                secondary: '#D8F3DC',
                accent: '#40916C',
                'bg-color': '#F0F4F8',
                'chat-user': '#D8F3DC',
                'chat-ai': '#FFFFFF',
            },
        },
    },
    plugins: [],
}
