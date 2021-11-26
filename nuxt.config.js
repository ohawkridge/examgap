// eslint-disable-next-line nuxt/no-cjs-in-config
const HoneybadgerSourceMapPlugin = require('@honeybadger-io/webpack')

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

  loading: { color: '#ef7a85' },

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
          primary: '#0099cc', // Washed azure
          accent: '#ef7a85', // Pink
          pink: '#f9b9b7', // Light pink
          yell: '#f4d06f', // Yellow
          heading: '#001f2a', // Text headings
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

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new HoneybadgerSourceMapPlugin({
        apiKey: process.env.HONEYB_KEY,
        assetsUrl: 'https://www.examgap.com',
        revision: 'master',
        // You can also enable deployment notifications:
        deploy: {
          environment: 'production',
          repository: 'https://github.com/ohawkridge/examgap',
        },
      }),
    ],
    extend(config) {},
    // https://github.com/iliyaZelenko/tiptap-vuetify-nuxt
    transpile: ['vuetify/lib', 'tiptap-vuetify'],
  },
}
