<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-app-bar color="#fefcfb" elevation="2" app>
      <v-container class="d-flex align-center px-0">
        <nuxt-link :to="teacher ? '/classes' : '/home'">
          <TheLogo />
        </nuxt-link>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-row class="d-flex justify-center">
          <v-col id="nav-fix" cols="12" md="5" class="text-center">
            <p>
              <svg
                height="46"
                width="46"
                viewBox="0 0 24 24"
                role="img"
                fill="#ef7a85"
              >
                <path :d="$icons.mdiExclamationThick"></path>
              </svg>
            </p>
            <p class="text-h6">
              {{ error.statusCode === 404 ? pageNotFound : otherError }}
            </p>
            <p>This will automatically be reported.</p>
            <p>
              <v-btn nuxt :to="home" elevation="0" outlined>
                Try going home
              </v-btn>
            </p>
            <p>
              If the problem persists, email
              <a href="mailto:support@examgap.com">support@examgap.com</a>.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { mdiExclamationThick } from '@mdi/js'
import TheLogo from '@/components/common/TheLogo'

export default {
  name: 'Error',
  components: {
    TheLogo,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
    }),
    home() {
      if (this.$store.state.user.id === '') return '/'
      return this.teacher ? '/classes' : '/home'
    },
    head() {
      return this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    },
  },
  created() {
    this.$icons = {
      mdiExclamationThick,
    }
  },
}
</script>
