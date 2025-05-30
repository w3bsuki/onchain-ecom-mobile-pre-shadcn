import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        },
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: [
                    'var(--font-poppins)',
                    'Poppins',
                    'Helvetica Neue',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'sans-serif'
                ],
                serif: [
                    'var(--font-bebas)',
                    'Bebas Neue',
                    'Impact',
                    'serif'
                ],
                display: [
                    'var(--font-bebas)',
                    'Bebas Neue',
                    'Impact',
                    'serif'
                ],
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    light: '#14B8A6',
                    base: '#0F766E',
                    dark: '#0D9488',
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    light: '#F472B6',
                    base: '#EC4899',
                    dark: '#DB2777',
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6',
            },
            borderRadius: {
                none: '0px',
                sm: 'calc(var(--radius) - 4px)',
                DEFAULT: '0.25rem',
                md: 'calc(var(--radius) - 2px)',
                lg: 'var(--radius)',
                xl: '0.75rem',
                '2xl': '1rem',
                full: '9999px',
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                fadeIn: 'fadeIn 0.2s ease-in-out',
                marquee: 'marquee 25s linear infinite',
                slideUpFade: 'slideUpFade 0.7s ease-out',
                slideUpFadeDelay: 'slideUpFade 0.7s ease-out 0.1s both',
                slideUpFadeDelay2: 'slideUpFade 0.7s ease-out 0.2s both',
                slideUpFadeDelay3: 'slideUpFade 0.7s ease-out 0.3s both',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                fadeIn: {
                    '0%': {
                        opacity: '0'
                    },
                    '100%': {
                        opacity: '1'
                    }
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                slideUpFade: {
                    '0%': { 
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '65ch',
                        color: 'var(--tw-prose-body)',
                        '[class~="lead"]': {
                            color: 'var(--tw-prose-lead)',
                        },
                        a: {
                            color: 'var(--tw-prose-links)',
                            textDecoration: 'underline',
                            fontWeight: '500',
                        },
                        strong: {
                            color: 'var(--tw-prose-bold)',
                            fontWeight: '600',
                        },
                        'ol[type="A"]': {
                            listStyleType: 'upper-alpha',
                        },
                        'ol[type="a"]': {
                            listStyleType: 'lower-alpha',
                        },
                        'ol[type="A" s]': {
                            listStyleType: 'upper-alpha',
                        },
                        'ol[type="a" s]': {
                            listStyleType: 'lower-alpha',
                        },
                        'ol[type="I"]': {
                            listStyleType: 'upper-roman',
                        },
                        'ol[type="i"]': {
                            listStyleType: 'lower-roman',
                        },
                        'ol[type="I" s]': {
                            listStyleType: 'upper-roman',
                        },
                        'ol[type="i" s]': {
                            listStyleType: 'lower-roman',
                        },
                        'ol[type="1"]': {
                            listStyleType: 'decimal',
                        },
                    },
                },
            },
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        require('@tailwindcss/typography'),
    ],
};

export default config;
