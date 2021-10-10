<template>
  <v-app>
    <v-container class="d-flex align-center">
      <nuxt-link to="/">
        <the-logo />
      </nuxt-link>
      <v-spacer />
      <nuxt-link to="/">Back home</nuxt-link>
    </v-container>
    <v-container class="fill-height">
      <v-row class="d-flex justify-center">
        <v-col id="nav-fix" cols="12" sm="8" md="6" lg="5" xl="4">
          <p class="text-h5 font-weight-bold text-center">Sign In</p>
          <v-form ref="form" @submit.prevent="login()">
            <v-text-field
              v-model="username"
              label="Username"
              color="primary"
              type="email"
              required
              outlined
              :rules="userRules"
              prepend-inner-icon="fa-user"
              autofocus
            ></v-text-field>
            <v-text-field
              v-model="pw"
              :type="show ? 'text' : 'password'"
              color="primary"
              label="Password"
              prepend-inner-icon="fa-light fa-lock-keyhole"
              required
              outlined
              :rules="passRules"
              @click:append="show = !show"
            ></v-text-field>
            <v-alert
              v-if="failed"
              icon="fa-exclamation-circle"
              border="top"
              text
              type="error"
            >
              Username or password incorrect.
            </v-alert>
            <v-btn
              color="primary"
              block
              large
              rounded
              elevation="0"
              :loading="loading"
              :disabled="loading"
              type="submit"
            >
              <span class="heading--text">Sign In</span></v-btn
            >
            <div class="mt-3 d-flex justify-space-between">
              <nuxt-link to="/reset">Reset password</nuxt-link>
              <nuxt-link to="/trial">Free trial</nuxt-link>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'

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
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          // Dispatch action to get user document
          await this.$store.dispatch('user/getUser', {
            username: this.username,
            password: this.pw,
          })
          this.$router.push('/home')
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
