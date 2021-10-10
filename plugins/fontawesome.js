import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fal } from '@fortawesome/pro-light-svg-icons'

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = true

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(fal)

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
