/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {height: 0},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: 0},
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            // backgroundImage: {
            //     redTheme: "linear-gradient(55deg, #371923 0%, #5C343D 100%)",
            //     blueTheme: "linear-gradient(55deg, #121B3F 0%, #1F2C6D 100%)",
            //     brownTheme: "linear-gradient(55deg, #2C1C10 0%, #5D3E2A 100%)",
            //     purpleTheme: "linear-gradient(55deg, #380723 0%, #5e1449 100%)",
            //     greenTheme: "linear-gradient(55deg, #0F2A1B 0%, #1F4A2E 100%)",
            //     yellowTheme: "linear-gradient(55deg, #3A2A0C 0%, #5D4A1E 100%)",
            //     orangeTheme: "linear-gradient(55deg, #3A1A0C 0%, #5D2A1E 100%)",
            // }
        },
    },
    plugins: [require("tailwindcss-animate")],
}