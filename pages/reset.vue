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
          <!-- Prevent submit btn posting form -->
          <v-form ref="form" @submit.prevent="reset()">
            <v-text-field
              v-model="username"
              label="Username or email"
              placeholder="jbloggs@school.org.uk"
              color="primary"
              type="email"
              required
              outlined
              :rules="userRules"
              autofocus
            ></v-text-field>
            <v-alert border="left" type="info" text>
              Students—your teacher can reset your password
            </v-alert>
            <v-alert v-if="failed" border="left" type="error" text>
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
    <!-- Success xx -->
    <v-dialog v-model="dialog" max-width="440">
      <v-card>
        <v-card-title class="d-flex justify-center py-6">
          <font-awesome-icon
            icon="fa-light fa-circle-check"
            class="fa-4x ico-green"
          />
        </v-card-title>
        <v-card-text>
          <p class="text-h5 text-center">Success</p>
          <p class="text-center text-body-1">
            You should receive a reset link via email shortly.
          </p>
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              rounded
              elevation="0"
              @click="dialog = false"
            >
              Close
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      dialog: false,
      loading: false,
      failed: false,
      username: '',
      userRules: [
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
          if (response === 'Email not found') {
            this.failed = true
          } else {
            this.failed = false
            this.dialog = true
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
