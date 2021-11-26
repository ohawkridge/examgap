import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fal } from '@fortawesome/pro-light-svg-icons'

// Register component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
// https://github.com/FortAwesome/vue-fontawesome
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
  complete: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'check'],
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
  checkboxIndeterminate: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'square-minus'],
    },
  },
  minus: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'minus'],
    },
  },
  info: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'circle-info'],
    },
  },
  error: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'circle-exclamation'],
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
      icon: ['fal', 'caret-down'],
    },
  },
  dropdown: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'caret-down'],
    },
  },
  delete: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'xmark'],
    },
  },
  clear: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'xmark'],
    },
  },
  eye: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'eye'],
    },
  },
  eyeSlash: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'eye-slash'],
    },
  },
  lock: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'lock-keyhole'],
    },
  },
  user: {
    component: FontAwesomeIcon,
    props: {
      icon: ['fal', 'user'],
    },
  },
}

export default new Vuetify({
  icons: {
    iconfont: 'faSvg',
    values: CUSTOM_ICONS,
  },
})
