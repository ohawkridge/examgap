<template>
  <v-app>
    <v-container class="d-flex align-center">
      <nuxt-link to="/">
        <the-logo />
      </nuxt-link>
      <v-spacer />
      <nuxt-link to="/signin">Sign In</nuxt-link>
    </v-container>
    <v-container class="fill-height">
      <v-row class="d-flex justify-center">
        <v-col id="nav-fix" cols="12" sm="8" md="6" lg="5" xl="4">
          <p class="text-h5 font-weight-bold text-center">Reset Password</p>
          <p class="class-h6 text-center">
            Enter your email address to request a password reset link.
            <strong>
              Student? Your teacher can also reset your password.
            </strong>
          </p>
          <!-- Prevent submit btn posting form -->
          <v-form ref="form" @submit.prevent="reset()">
            <v-text-field
              v-model="username"
              label="Email"
              :rules="rules"
              placeholder="jbloggs@school.org.uk"
              color="primary"
              type="email"
              prepend-inner-icon="$user"
              required
              outlined
              autofocus
            ></v-text-field>
            <v-alert v-if="failed" border="left" type="error" text dense>
              Username not found
            </v-alert>
            <v-btn
              color="primary"
              elevation="0"
              block
              large
              rounded
              :loading="loading"
              :disabled="loading"
              type="submit"
              >Reset password</v-btn
            >
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
      username: '',
      rules: [
        (v) => !!v || 'Email is required',
        (v) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'Invalid e-mail.'
        },
      ],
    }
  },
  head() {
    return {
      title: 'Reset Password',
    }
  },
  methods: {
    async reset() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const url = new URL(
            '/.netlify/functions/sendPasswordResetEmail',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              email: this.username,
            }),
            method: 'POST',
          })
          response = await response.text()
          if (response === 'ok') {
            this.$router.push('/reset-signin')
          }
          if (response === 'Email not found') {
            this.failed = true
          }
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error resetting password',
          })
        } finally {
          this.loading = false
          this.username = ''
          this.$refs.form.resetValidation()
        }
      }
    },
  },
}
</script>
