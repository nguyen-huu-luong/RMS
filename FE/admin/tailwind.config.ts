import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },

            colors: {
                primary: "#4A58EC",
                bgsecondary: "#E7E9FD",
            },

            width: {
                sidebar: "250px",
            },
            height: {
                header: "48px",
            },

            spacing: {
                sidebar: "250px",
                header: "48px",
            },
        },
    },
    plugins: [require("daisyui")],
    safelist: [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'bg-teal-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-cyan-500',
    ],
};
export default config;
