<template>
  <v-app>
    <v-app-bar elevation="0" color="transparent" app>
      <v-container class="d-flex align-center px-0">
        <nuxt-link to="/home">
          <the-logo />
        </nuxt-link>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-row class="d-flex justify-center">
          <v-col id="nav-fix" cols="12" md="7" lg="6" class="text-center">
            <p class="text-h6 error--text">
              {{ error.statusCode === 404 ? pageNotFound : otherError }}
            </p>
            <p>This will automatically be reported.</p>
            <p>
              If the problem persists, email
              <a class="text-decoration-none" href="mailto:support@examgap.com"
                >support@examgap.com</a
              >.
            </p>
            <p>
              <v-btn
                elevation="0"
                rounded
                color="primary"
                @click="$router.go(-1)"
              >
                Try going back
              </v-btn>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
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
      otherError: 'Apologies, an error occurred.',
    }
  },
  computed: {
    head() {
      return this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    },
  },
}
</script>
