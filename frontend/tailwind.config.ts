import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './src/*.{js,jsx,ts,tsx}', 
    'node_modules/preline/dist/*.ts',
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      colors: {
        'custom-light-green':'#f5faeb',
        'custom-green': '#ECF4D6', // 任意の名前を付けて色を定義する
        'custom-blue': '#265073',
        'custom-teal': '#2D9596',
        'custom-light-blue': '#9AD0C2',
      },
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
};
export default config;