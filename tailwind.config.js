const { default: daisyui } = require('daisyui');

module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        fontFamily: {
            "space grotesk": ["Space Grotesk", "sans-serif"]
        },
        extend: {
            animation: {
                fadeIn: 'fadeIn 0.3s ease-in-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                }
            }
        },
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: ['night'],
    }
}
