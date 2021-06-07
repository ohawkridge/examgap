import Vue from 'vue'
import HoneybadgerVue from '@honeybadger-io/vue'

const config = {
  apiKey: 'hbp_xaKmNAUS8NVp6kBJfKcCMEYe8iCCi30wuKXo',
  environment: process.env.NODE_ENV,
}

Vue.use(HoneybadgerVue, config)

// This is handy for testing; remove it in production.
// window.Honeybadger = Vue.$honeybadger
