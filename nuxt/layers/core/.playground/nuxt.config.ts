import { join, resolve } from 'path'

const playgroundDir = resolve(__dirname)
const currentDir = resolve(playgroundDir, '..')
export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/test-utils/module', "@nuxt/image"],
  compatibilityDate: "2024-07-16",
  future: {
    compatibilityVersion: 4
  },
  imports: {
    dirs: [
      'stores',
      'composables',
      'enums',
      'interfaces',
      'types',
      'utils'
    ]
  },
  // css: [join(currentDir, './app/assets/css/core-main.css')],
  alias: {
    BCGovFonts: join(currentDir, './public/fonts/BCSans'),
    BCGovLogoSmEn: join(currentDir, './public/BCGovLogo/gov_bc_logo_vert_en.png'),
    BCGovLogoSmFr: join(currentDir, './public/BCGovLogo/gov_bc_logo_vert_fr.png'),
    BCGovLogoLgEn: join(currentDir, './public/BCGovLogo/gov_bc_logo_horiz_en.png'),
    BCGovLogoLgFr: join(currentDir, './public/BCGovLogo/gov_bc_logo_horiz_fr.png')
  }
})