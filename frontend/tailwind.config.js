/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple System Colors
        'system-blue': '#007AFF',
        'system-green': '#34C759',
        'system-indigo': '#5856D6',
        'system-orange': '#FF9500',
        'system-pink': '#FF2D92',
        'system-purple': '#AF52DE',
        'system-red': '#FF3B30',
        'system-teal': '#5AC8FA',
        'system-yellow': '#FFCC00',
        
        // Apple Label Colors
        'label-primary': '#000000',
        'label-secondary': '#3C3C43',
        'label-tertiary': '#787880',
        'label-quaternary': '#9E9EA3',
        
        // Apple Fill Colors
        'fill-quaternary': '#F2F2F7',
        'fill-tertiary': '#E5E5EA',
        'fill-secondary': '#D1D1D6',
        'fill-primary': '#C7C7CC',
        
        // Apple Separator Colors
        'separator-opaque': '#C6C6C8',
        'separator-non-opaque': '#C6C6C8',
        
        // Apple Background Colors
        'system-background': '#FFFFFF',
        'secondary-system-background': '#F2F2F7',
        'tertiary-system-background': '#FFFFFF',
        
        // Apple Grouped Background Colors
        'system-grouped-background': '#F2F2F7',
        'secondary-system-grouped-background': '#FFFFFF',
        'tertiary-system-grouped-background': '#F2F2F7',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
        'sf-pro-text': ['SF Pro Text', 'system-ui', 'sans-serif'],
        'sf-pro-display': ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      animation: {
        'apple-fade-in': 'appleFadeIn 0.3s ease-out',
        'apple-scale-in': 'appleScaleIn 0.2s ease-out',
      },
      keyframes: {
        appleFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        appleScaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
