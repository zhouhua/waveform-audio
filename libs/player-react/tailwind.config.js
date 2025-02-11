import baseConfig from '@waveform-audio/inf/tailwind';
import tailwindcssAnimate from 'tailwindcss-animate';
/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: ['class'],
  plugins: [tailwindcssAnimate],
  prefix: 'wa-',
  safelist: [
    'dark',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--wa-base-radius)',
        md: 'calc(var(--wa-base-radius) - 2px)',
        sm: 'calc(var(--wa-base-radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--wa-base-accent))',
          foreground: 'hsl(var(--wa-base-accent-foreground))',
        },
        background: 'hsl(var(--wa-base-background))',
        border: 'hsl(var(--wa-base-border))',
        card: {
          DEFAULT: 'hsl(var(--wa-base-card))',
          foreground: 'hsl(var(--wa-base-card-foreground))',
        },
        chart: {
          1: 'hsl(var(--wa-base-chart-1))',
          2: 'hsl(var(--wa-base-chart-2))',
          3: 'hsl(var(--wa-base-chart-3))',
          4: 'hsl(var(--wa-base-chart-4))',
          5: 'hsl(var(--wa-base-chart-5))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--wa-base-destructive))',
          foreground: 'hsl(var(--wa-base-destructive-foreground))',
        },
        foreground: 'hsl(var(--wa-base-foreground))',
        input: 'hsl(var(--wa-base-input))',
        muted: {
          DEFAULT: 'hsl(var(--wa-base-muted))',
          foreground: 'hsl(var(--wa-base-muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--wa-base-popover))',
          foreground: 'hsl(var(--wa-base-popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--wa-base-primary))',
          foreground: 'hsl(var(--wa-base-primary-foreground))',
        },
        ring: 'hsl(var(--wa-base-ring))',
        secondary: {
          DEFAULT: 'hsl(var(--wa-base-secondary))',
          foreground: 'hsl(var(--wa-base-secondary-foreground))',
        },
      },
    },
  },
};
