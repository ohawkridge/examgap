// import webpack from 'webpack'
import HoneybadgerSourceMapPlugin from '@honeybadger-io/webpack'

// const { HONEYB_KEY } = process.env

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Exclude most pages
  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-generate#exclude
  generate: {
    exclude: [],
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
    script: [{ src: 'https://cdn.headwayapp.co/widget.js' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/examgap.css'],

  loading: { color: '#9f3d49' },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/filters.js' },
    { src: '@/plugins/snack.js' },
    { src: '@/plugins/tiptapVuetify.js' },
    { src: '@/plugins/honeybadger.js', mode: 'client' },
    { src: '@/plugins/persistedState.js', mode: 'client' },
    { src: '@/plugins/vuetify.js' },
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
  modules: [],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: {
      icons: false,
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#00668b',
          secondary: '#a03c49',
          tertiary: '#765b00',
          error: '#ba1b1b',
          background: '#fbfcff',
          surface: '#41484d',
        },
        dark: {
          primary: '#74d1ff',
          secondary: '#ffb2b9',
          tertiary: '#ecc248',
          error: '#ffb4a9',
          background: '#191c1e',
        },
      },
    },
  },

  // Inject config variables into Nuxt
  // https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config
  // N.B. Netlify automatically sets NODE_ENV to production/development
  publicRuntimeConfig: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://www.examgap.com'
        : 'http://localhost:8888',
  },
  privateRuntimeConfig: {
    apiKey: process.env.HONEYB_KEY,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new HoneybadgerSourceMapPlugin({
        apiKey: process.env.HONEYB_KEY,
        assetsUrl: 'https://www.examgap.com/',
        revision: process.env.COMMIT_REF,
        deploy: {
          environment: 'production',
          repository: 'https://github.com/ohawkridge/examgap',
        },
      }),
    ],
    // https://stackoverflow.com/questions/69206509/nuxt-how-can-i-get-sourcemap-files-and-where-can-i-find-them-in-production
    // https://github.com/honeybadger-io/honeybadger-webpack/issues/325
    extend(config, { isClient }) {
      if (isClient && process.env.NODE_ENV === 'production') {
        config.devtool = 'source-map'
      }
    },
    // https://github.com/iliyaZelenko/tiptap-vuetify-nuxt
    transpile: ['vuetify/lib', 'tiptap-vuetify'],
  },
}
