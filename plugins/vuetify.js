import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCheck,
  faCircleCheck,
  faCircleUser,
  faCircleMinus,
  faCircleInfo,
  faCircleExclamation,
  faCommentLines,
  faPlus,
  faCalendar,
  faArrowRight,
  faArrowsLeftRight,
  faPaperPlane,
  faArrowLeft,
  faCopy,
  faChevronRight,
  faChevronLeft,
  faCaretDown,
  faSortUp,
  faArrowDownToBracket,
  faUser,
  faUserGroup,
  faLockKeyhole,
  faUserGraduate,
  faCommentExclamation,
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faSquare,
  faSquareCheck,
  faFlag,
  faSquareMinus,
  faRepeat,
  faCheckDouble,
  faBars,
  faXmark,
  faEye,
  faEyeSlash,
  faArrowsRepeat,
  faTimer,
  faBullseyePointer,
  faBoxArchive,
  faMaximize,
  faCarCrash,
  faEarListen,
  faCloudArrowUp,
  faCloudCheck,
  faClockRotateLeft,
  faCircle1,
  faCircle2,
  faCircle3,
  faTrafficLight,
  faAngleDown,
  faPenClip,
  faTrashCanXmark,
  faReceipt,
  faCalendarStar,
  faHeadSideBrain,
  faQuoteLeft,
  faUsers,
} from '@fortawesome/pro-light-svg-icons'
import { faCircleCheck as fasCircleCheck } from '@fortawesome/free-solid-svg-icons'

// Register component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
// https://github.com/FortAwesome/vue-fontawesome
library.add(
  faCheck,
  faCircleCheck,
  faCircleUser,
  faCircleMinus,
  faCircleInfo,
  faCircleExclamation,
  faCommentLines,
  faPlus,
  faCalendar,
  faArrowRight,
  faArrowsLeftRight,
  faPaperPlane,
  faArrowLeft,
  faCopy,
  faChevronRight,
  faChevronLeft,
  faCaretDown,
  faSortUp,
  faArrowDownToBracket,
  faUser,
  faUserGroup,
  faLockKeyhole,
  faUserGraduate,
  faCommentExclamation,
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faSquare,
  faSquareCheck,
  faFlag,
  faSquareMinus,
  faRepeat,
  faCheckDouble,
  faBars,
  faXmark,
  faEye,
  faEyeSlash,
  faArrowsRepeat,
  faTimer,
  faBullseyePointer,
  faBoxArchive,
  faMaximize,
  faCarCrash,
  faEarListen,
  faCloudArrowUp,
  faCloudCheck,
  faClockRotateLeft,
  faCircle1,
  faCircle2,
  faCircle3,
  faTrafficLight,
  faAngleDown,
  faPenClip,
  faTrashCanXmark,
  faReceipt,
  faCalendarStar,
  faHeadSideBrain,
  faQuoteLeft,
  fasCircleCheck,
  faUsers
)

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
      icon: ['fal', 'circle-minus'],
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
