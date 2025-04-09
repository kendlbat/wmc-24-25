import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
    theme: {
        extend: {},
    },
    plugins: [flowbite.plugin()],
};

export default config;
