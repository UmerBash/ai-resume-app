/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#030712',
                },
                primary: {
                    500: '#6366f1', // Indigo
                    600: '#4f46e5',
                },
                secondary: {
                    400: '#22d3ee', // Cyan
                    500: '#06b6d4',
                },
                accent: {
                    500: '#a855f7', // Purple
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                'gradient-dark': 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
            },
            keyframes: {
                scan: {
                    '0%': { top: '0%' },
                    '50%': { top: '100%' },
                    '100%': { top: '0%' },
                }
            },
            animation: {
                'scan': 'scan 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
