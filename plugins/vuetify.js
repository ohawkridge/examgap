import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fal } from '@fortawesome/pro-light-svg-icons'

Vue.component('FontAwesomeIcon', FontAwesomeIcon) // Register component globally
library.add(fal) // Include needed icons

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'faSvg',
    // https://stackoverflow.com/questions/57492749/font-awesome-svg-icons-not-working-with-vuetify
    // Needed?
    values: {
      checkboxOn: 'fas fa-check-square',
      checkboxOff: 'fas fa-square',
      sortUp: 'fas fa-sort-up',
      sortDown: 'fas fa-sort-down',
    },
  },
})
