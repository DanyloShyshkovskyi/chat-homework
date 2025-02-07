/** @type {import('tailwindcss').Config} */
import tailwindAnimated from 'tailwindcss-animate'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  prefix: '',
  theme: {
    fontSize: {
      ...defaultTheme.fontSize,
      sm: '13px',
      xs: '11px',
    },
    transitionDuration: {
      DEFAULT: '300ms',
    },
    screens: {
      ...defaultTheme.screens,
      '2xl': '1400px',
      '3xl': '1600px',
      '4xl': '1800px',
    },
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    colors: {
      ...colors,
      gradient: 'var(--gradient)',
      background: 'hsl(var(--background) / <alpha-value>)',
      foreground: 'hsl(var(--foreground) / <alpha-value>)',
      muted: 'hsl(var(--muted) / <alpha-value>)',
      'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
      popover: 'hsl(var(--popover) / <alpha-value>)',
      'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
      card: 'hsl(var(--card) / <alpha-value>)',
      'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
      border: 'hsl(var(--border) / <alpha-value>)',
      input: 'hsl(var(--input) / <alpha-value>)',
      'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
      secondary: 'hsl(var(--secondary) / <alpha-value>)',
      'secondary-foreground':
        'hsl(var(--secondary-foreground) / <alpha-value>)',
      accent: 'hsl(var(--accent) / <alpha-value>)',
      'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
      destructive: 'hsl(var(--destructive) / <alpha-value>)',
      'destructive-foreground':
        'hsl(var(--destructive-foreground) / <alpha-value>)',
      ring: 'hsl(var(--ring) / <alpha-value>)',
    },
    extend: {
      boxShadow: {
        sidebar: `
        -6px 21px 49px 0px #6B6B6B1A,
        -23px 85px 88px 0px #6B6B6B17,
        -51px 192px 119px 0px #6B6B6B0D,
        -91px 341px 141px 0px #6B6B6B03,
        -143px 533px 154px 0px #6B6B6B00;`,
        1: `
        0px 13px 29px 0px #9494941A,
        0px 53px 53px 0px #94949417,
        0px 119px 71px 0px #9494940D,
        0px 212px 85px 0px #94949403,
        0px 331px 93px 0px #94949400`,
        reversed: `
        0 0 0 99999px rgb(248 248 248 / var(--tw-bg-opacity))
        `,
      },
      transitionProperty: {
        width: 'width',
        spacing: 'margin, padding',
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
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
        serif: ['Visby', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [tailwindAnimated],
}
