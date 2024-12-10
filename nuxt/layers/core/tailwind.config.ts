import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: ['*.{html,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['BCSans', 'Verdana', 'Arial', 'sans-serif']
      },
      listStyleType: {
        alpha: 'lower-alpha',
        upperAlpha: 'upper-alpha'
      },
      maxWidth: {
        bcGovMd: '1020px',
        bcGovLg: '1360px',
        bcGovInput: '600px'
      },
      colors: {
        bcGovColor: {
          // these colors are as defined in styleguide:
          // https://preview.uxpin.com/73eb31e6346bc2863a066f02218a3af289325619#/pages/138840439/simulate/sitemap?mode=i
          // for more details see previous link
          // last updated on (2023-10-16)
          // PRIMARY COLOURS
          footer: '#003366',
          header: '#003366',
          navDivider: '#FCBA19',
          // LINK COLOURS
          activeBlue: '#1669BB',
          markBlue: '#1a5a96',
          // TEXT/NON-CLICKABLE COLOURS
          darkGray: '#212529',
          midGray: '#495057',
          lightGray: '#757575',
          nonClickable: '#38598A',
          // BACKGROUND COLOURS
          white: '#FFFFFF',
          gray1: '#F1F3F5',
          gray2: '#E2E8EE',
          lightBlue: '#E4EDF7',
          // LINES
          hairlinesOnWhite: '#DEE2E6',
          specialityDottedLines: '#899EB2',
          formFieldLines: '#6F7780',
          // RESULT COLOURS
          caution: '#F8661A', // use on Caution Icon or Large 19px bold+ text only (on white backgrounds only). Not for small text.
          error: '#d3272c' // ok for error text or icons)
        },
        outcomes: {
          approved: '#2E8540',
          error: '#D3272C',
          caution: '#F8661A' // caution icon or large text
        },
        // used color generator recommended by tailwind docs: https://uicolors.app/create
        bcGovGray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#232529'
        },
        blue: {
          50: '#e4edf7',
          100: '#e0e7ed',
          150: '#b3c2d1',
          200: '#8099b3',
          300: '#4d7094',
          350: '#38598a',
          400: '#26527d',
          500: '#1669bb',
          600: '#125192',
          700: '#002e5e',
          800: '#002753',
          900: '#002049',
          950: '#001438'
        },
        red: {
          50: '#fef2f2',
          100: '#fde3e4',
          200: '#fdcbcc',
          300: '#faa7a9',
          400: '#f57478',
          500: '#eb484d',
          600: '#d3272c',
          700: '#b52024',
          800: '#961e21',
          900: '#7d1f22',
          950: '#440b0d'
        },
        yellow: {
          50: '#fffbeb',
          100: '#fef2c7',
          200: '#fee589',
          300: '#fdd14c',
          400: '#fcba19',
          500: '#f69b0a',
          600: '#da7505',
          700: '#b55108',
          800: '#933e0d',
          900: '#79340e',
          950: '#451903'
        },
        green: {
          50: '#f2fbf4',
          100: '#e2f6e6',
          200: '#c6eccd',
          300: '#99dca6',
          400: '#65c378',
          500: '#40a755',
          600: '#2e8540',
          700: '#286d37',
          800: '#24572f',
          900: '#1f4828',
          950: '#0c2713'
        },
        midnightBlue: {
          50: '#eef7ff',
          100: '#dceeff',
          200: '#b2dfff',
          300: '#6dc6ff',
          400: '#20a8ff',
          500: '#008dff',
          600: '#006edf',
          700: '#0057b4',
          800: '#004a94',
          900: '#003366',
          950: '#002651'
        }
      },
      // @ts-ignore: ignore theme as any
      typography: ({ theme }) => ({
        bcGov: {
          css: {
            '--tw-prose-body': theme('colors.bcGovGray.700'),
            '--tw-prose-headings': theme('colors.bcGovGray.900'),
            '--tw-prose-counters': theme('colors.bcGovGray.900'),
            '--tw-prose-bullets': theme('colors.bcGovGray.900'),
            '--tw-prose-code': theme('colors.bcGovGray.900'),
            '--tw-prose-pre-code': theme('colors.bcGovGray.900'),
            '--tw-prose-pre-bg': theme('colors.bcGovColor.white')
          }
        }
      })
    }
  }
}
