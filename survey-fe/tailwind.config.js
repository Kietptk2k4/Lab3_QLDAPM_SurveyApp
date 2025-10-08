/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Bảng màu gốc bạn đưa
        'brand-ice': '#20acacff',   // very light cyan
        'brand-cyan': '#28a2a2ff',  // cyan
        'brand-mint': '#238e73ff',  // turquoise/mint (chính)
        'brand-sun':  '#FFCC66',  // light orange
        'brand-amber':'#FFCC33',  // dark orange
        'ink': '#0D2438',         // text đậm
      },
      // Semantic aliases (dễ dùng trong component)
      textColor: {
        DEFAULT: '#0D2438',
        brand: '#0D2438',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #CCFFFF 0%, #99FFFF 35%, #238e73ff 100%)',
        'brand-accent':   'linear-gradient(135deg, #FFCC33 0%, #FFCC66 100%)',
      },
      boxShadow: {
        'brand': '0 10px 25px rgba(51,255,204,0.25)',
        'soft':  '0 6px 18px rgba(13,36,56,0.08)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      ringColor: {
        'brand': '#1b9677ff',
      },
    },
  },
  plugins: [],
}
