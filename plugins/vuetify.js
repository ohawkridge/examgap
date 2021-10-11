import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fal } from '@fortawesome/pro-light-svg-icons'

// Register component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
library.add(fal)

Vue.use(Vuetify)

// https://stackoverflow.com/questions/52030435/fontawesome-with-vuetify-how-to-include-font-awesome-icons-within-the-v-icon-c
const CUSTOM_ICONS = {
  sort: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'sort-up'],
    },
  },
  menu: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'bars'],
    },
  },
  checkboxOff: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'square'],
    },
  },
  checkboxOn: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'square-check'],
    },
  },
  next: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'chevron-right'],
    },
  },
  prev: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'chevron-left'],
    },
  },
  expand: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'chevron-down'],
    },
  },
}

export default new Vuetify({
  icons: {
    iconfont: 'faSvg',
    values: CUSTOM_ICONS,
  },
})
