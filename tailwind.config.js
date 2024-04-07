/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './modules/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        dark: {
          DEFAULT: 'rgba(33, 33, 33, 1)',
          secondary: 'rgba(64, 64, 64, 1)',
          placeholder: 'rgba(148, 148, 148, 1)',
        },
        light: {
          DEFAULT: 'rgba(255, 255, 255, 1)',
          secondary: 'rgba(255, 255, 255, 0.75)',
          placeholder: 'rgba(255, 255, 255, 0.4)',
        },
        icon: {
          dark: {
            DEFAULT: 'rgba(33, 33, 33, 1)',
            descriptive: 'rgba(148, 148, 148, 1)',
          },
          light: {
            DEFAULT: 'rgba(255, 255, 255, 1)',
            descriptive: 'rgba(255, 255, 255, 0.4)',
          },
        },
        btn: {
          dark: {
            DEFAULT: 'rgba(12, 12, 12, 1)',
            hover: 'rgba(12, 12, 12, 0.85)',
          },
          light: {
            DEFAULT: 'rgba(255, 255, 255, 1)',
            hover: 'rgba(255, 255, 255, 0.9)',
          },
          accent: {
            DEFAULT: 'rgba(216, 33, 55, 1)',
            hover: 'rgba(216, 33, 55, 0.85)',
          },
        },
        dropdown: {
          border: {
            DEFAULT: 'rgba(30, 30, 30, 0.08)',
            active: 'rgba(165, 165, 165, 1)',
            disabled: 'rgba(30, 30, 30, 1)',
          },
          'background-disabled': 'rgba(249, 249, 249, 1)',
        },
        input: {
          border: {
            DEFAULT: 'rgba(30, 30, 30, 0.08)',
            active: 'rgba(165, 165, 165, 1)',
            disabled: 'rgba(30, 30, 30, 1)',
          },
          'background-disabled': 'rgba(249, 249, 249, 1)',
        },
        checkbox: {
          border: 'rgba(148, 148, 148, 1)',
          background: 'rgba(243, 243, 245, 1)',
          hover: 'rgba(33, 33, 33, 1)',
        },
        background: {
          background: 'rgba(12, 12, 12, 1)',
          light: 'rgba(255, 255, 255, 1)',
          'light-gray': 'rgba(243, 243, 243, 1)',
          skeleton: 'rgba(240, 240, 240, 1)',
        },
        separator: {
          dark: 'rgba(30, 30, 30, 0.08)',
          light: 'rgba(255, 255, 255, 0.2)',
        },
        primary: {
          red: {
            DEFAULT: 'rgba(216, 33, 55, 1)',
          },
          black: {
            DEFAULT: 'rgba(12, 12, 12, 1)',
          },
          white: {
            DEFAULT: 'rgba(255, 255, 255, 1)',
          },
        },
        'header-border': 'rgba(0, 0, 0, 0.05)',
        switch: 'rgba(21, 7, 75, 0.08)',
        'sticky-background': '#fafafa',
        overlay: 'rgba(0, 0, 0, 0.5)',
        avatar: 'rgb(196, 196, 196)',
        focused: 'rgba(216, 33, 55, 0.35)',
        accent: 'rgba(216, 33, 55, 1)',
        scrim: 'rgba(12, 12, 12, 0.3)',
        error: {
          DEFAULT: 'rgba(235, 0, 0, 1)',
          light: 'rgba(252, 218, 221, 1)',
        },
        success: {
          DEFAULT: 'rgba(80, 194, 0, 1)',
          light: 'rgba(221, 238, 206, 1)',
        },
        info: {
          DEFAULT: 'rgba(0, 134, 209, 1)',
          light: 'rgba(207, 230, 245, 1)',
        },
        warning: {
          DEFAULT: 'rgba(255, 176, 103, 1)',
          light: 'rgba(254, 239, 226, 1)',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
