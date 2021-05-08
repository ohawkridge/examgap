import { execSync } from 'child_process'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Exclude most pages
  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-generate#exclude
  generate: {
    exclude: [
      /^\/home/,
      /^\/classes/,
      /^\/assignment/,
      /^\/course/,
      /^\/grades/,
      /^\/question/,
      /^\/report/,
      /^\/response/,
      /^\/answer/,
      /^\/profile/,
      /^\/settings/,
    ],
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s' + ' — Examgap',
    title: 'Improve your Computer Science results',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/examgap.css'],

  loading: { color: '#ef7a85' },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/filters.js' },
    { src: '@/plugins/snack.js' },
    { src: '@/plugins/localStorage.js', mode: 'client' },
    { src: '@/plugins/tiptapVuetify.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      'nuxt-rollbar-module',
      {
        serverAccessToken: process.env.ROLLBAR_SERVER_TOKEN,
        clientAccessToken: process.env.ROLLBAR_CLIENT_TOKEN,
        config: {
          payload: {
            environment: process.env.NODE_ENV,
            client: {
              javascript: {
                source_map_enabled: true, // true by default
                code_version: JSON.stringify(codeVersion()),
                guess_uncaught_frames: true,
              },
            },
          },
        },
      },
    ],
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: {
      icons: false,
    },
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#0078a0',
          accent: '#ef7a85',
          secondary: '#b7d1da',
          background: '#fefcfb',
        },
      },
    },
  },

  // Inject config variables into Nuxt
  // https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config
  publicRuntimeConfig: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://www.examgap.com'
        : 'http://localhost:8888',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isClient }) {
      if (isClient) {
        config.devtool = 'source-map'
      }
    },
    // https://github.com/iliyaZelenko/tiptap-vuetify-nuxt
    transpile: ['vuetify/lib', 'tiptap-vuetify'],
    terser: {
      sourceMap: true,
    },
  },
}

function codeVersion() {
  return execSync('git rev-parse --short HEAD').toString().trim()
}
