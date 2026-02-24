/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#fffcf2',
                    100: '#fff8e1',
                    200: '#ffefc1',
                    300: '#ffdf8f',
                    400: '#ffc84d',
                    500: '#f9a825', // Primary Gold
                    600: '#d78c0e',
                    700: '#b06f0e',
                    800: '#8f5b12',
                    900: '#754a14',
                },
                luxury: {
                    charcoal: '#1a1a1a',
                    cream: '#fdfcf0',
                    pearl: '#f3f4f6',
                }
            },
            fontFamily: {
                serif: ['Cinzel', 'serif'],
                sans: ['Montserrat', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'pop-in': 'popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                popIn: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
