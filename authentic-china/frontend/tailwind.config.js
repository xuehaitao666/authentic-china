/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1E1E1E',      /* 沉香水墨黑 */
        'ink-light': '#2D3139',      /* 淡墨灰 */
        'paper-base': '#F4F1EC',     /* 宣纸底色 */
        'paper-light': '#FAF9F6',    /* 亮宣纸色 */
        'china-red': '#C83C23',      /* 传统中国红/朱砂红 */
      },
      fontFamily: {
        'sans': ['Inter', 'Noto Sans SC', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['"Noto Serif SC"', '"Songti SC"', 'STSong', 'sans-serif']
      }
    },
  },
  plugins: [],
}
