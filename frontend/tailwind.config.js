/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // System Colors
        'system-blue': '#007AFF',
        'system-green': '#34C759',
        'system-orange': '#FF9500',
        'system-red': '#FF3B30',
        'system-purple': '#AF52DE',
        'system-pink': '#FF2D92',
        'system-yellow': '#FFCC02',
        
        // System Backgrounds
        'system-background': '#F2F2F7',
        'system-secondary-background': '#FFFFFF',
        'system-tertiary-background': '#F2F2F7',
        
        // System Labels
        'label-primary': '#000000',
        'label-secondary': '#3C3C43',
        'label-tertiary': '#8E8E93',
        'label-quaternary': '#C7C7CC',
        
        // System Separators
        'separator-opaque': '#C6C6C8',
        'separator-non-opaque': '#C6C6C8',
        
        // System Fill
        'system-fill': '#787880',
        'system-fill-secondary': '#F2F2F7',
        'system-fill-tertiary': '#E5E5EA',
        'system-fill-quaternary': '#D1D1D6',
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '24': '24px',
        '28': '28px',
      },
      boxShadow: {
        'apple': '0 2px 20px rgba(0, 0, 0, 0.08)',
        'apple-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'apple-button': '0 4px 20px rgba(0, 122, 255, 0.3)',
        'apple-button-hover': '0 6px 25px rgba(0, 122, 255, 0.4)',
        'apple-header': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        '20': '20px',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
        'pulse-gentle': 'pulse 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '1000': '1000',
      },
    },
  },
  plugins: [
    // Custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
