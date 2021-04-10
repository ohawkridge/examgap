<template>
  <v-app :style="{ background: $vuetify.theme.themes['light'].background }">
    <v-app-bar color="#f1eeee" app elevation="0">
      <v-container class="d-flex align-center px-0">
        <nuxt-link :to="teacher ? '/classes' : '/home'">
          <TheLogo />
        </nuxt-link>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="5" class="d-flex align-center">
            <svg
              height="92"
              width="92"
              viewBox="0 0 24 24"
              role="img"
              fill="#f44336"
            >
              <path :d="$icons.mdiAlertCircleOutline"></path>
            </svg>
            <p class="text-h6 text-center mb-0 ml-2">
              {{ error.statusCode === 404 ? pageNotFound : otherError }}
            </p>
          </v-col>
          <v-col cols="12" md="5">
            <p>
              Sorry, an error has occurred. This will automatically be reported.
            </p>
            <p><NuxtLink :to="home">Try going home</NuxtLink>.</p>
            <p>
              If the problem persists, contact
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
import { mdiAlertCircleOutline } from '@mdi/js'
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
      mdiAlertCircleOutline,
    }
  },
}
</script>
