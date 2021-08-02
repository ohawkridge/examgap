<template>
  <v-app>
    <v-container class="d-flex align-center">
      <nuxt-link to="/">
        <the-logo />
      </nuxt-link>
    </v-container>
    <v-container class="fill-height">
      <v-row class="d-flex justify-center">
        <v-col id="nav-fix" cols="12" sm="8" md="6" lg="5" xl="4">
          <p class="text-h5 font-weight-bold text-center">Sign In</p>
          <v-form ref="form" @submit.prevent="login()">
            <v-text-field
              v-model="username"
              :prepend-inner-icon="$icons.mdiAccountOutline"
              label="Username"
              color="primary"
              type="text"
              required
              outlined
              :rules="userRules"
              autofocus
            ></v-text-field>
            <v-text-field
              v-model="pw"
              :prepend-inner-icon="$icons.mdiLockOutline"
              :append-icon="
                show ? $icons.mdiEyeOutline : $icons.mdiEyeOffOutline
              "
              :type="show ? 'text' : 'password'"
              color="primary"
              label="Password"
              required
              outlined
              :rules="passRules"
              @click:append="show = !show"
            ></v-text-field>
            <v-alert
              v-if="failed"
              border="left"
              text
              dense
              type="error"
              :icon="$icons.mdiAlertOutline"
            >
              Username or password incorrect
            </v-alert>
            <v-btn
              color="primary"
              block
              large
              elevation="0"
              :loading="loading"
              :disabled="loading"
              type="submit"
              >Sign In</v-btn
            >
            <div class="mt-3 d-flex justify-space-between">
              <nuxt-link to="/reset" class="text-decoration-none"
                >Reset password</nuxt-link
              >
              <nuxt-link to="/trial" class="text-decoration-none"
                >Free trial</nuxt-link
              >
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'
import {
  mdiAccountOutline,
  mdiAlertOutline,
  mdiLockOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
} from '@mdi/js'

export default {
  components: {
    TheLogo,
  },
  data() {
    return {
      loading: false,
      failed: false,
      show: false,
      username: '',
      pw: '',
      userRules: [(v) => !!v || 'Username is required'],
      passRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 2) || 'Password must be at least 2 characters',
      ],
    }
  },
  head() {
    return {
      title: 'Sign In',
    }
  },
  created() {
    this.$icons = {
      mdiAccountOutline,
      mdiAlertOutline,
      mdiLockOutline,
      mdiEyeOutline,
      mdiEyeOffOutline,
    }
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          let username = this.username
          let database = 'prod'
          if (this.username.includes('+DEV')) {
            const i = this.username.indexOf('+')
            username = this.username.slice(0, i) + this.username.slice(i + 4)
            database = 'dev'
          }
          // Dispatch action to get user document
          await this.$store.dispatch('user/getUser', {
            username,
            password: this.pw,
            database,
          })
          // Remember which database
          this.$store.commit('app/setDatabase', database)
          // Route to appropriate home page
          const isTeacher = this.$store.state.user.teacher
          this.$router.push(isTeacher ? `/classes` : `/home`)
        } catch (err) {
          console.log(err)
          this.failed = true
        } finally {
          this.$refs.form.resetValidation()
          this.loading = false
        }
      }
    },
  },
}
</script>
