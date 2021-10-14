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
              placeholder="joe.bloggs@yourschool.org.uk"
              color="primary"
              type="email"
              validate-on-blur
              required
              outlined
              :rules="userRules"
              autofocus
            ></v-text-field>
            <v-alert border="top" text>
              <font-awesome-icon
                slot="prepend"
                icon="fa-light fa-circle-info"
                class="mr-2 fa-lg"
              />
              Student? Your teacher can reset your password.
            </v-alert>
            <v-alert v-if="failed" border="top" text type="error">
              <font-awesome-icon
                slot="prepend"
                icon="fa-light fa-circle-exclamation"
                class="mr-2 fa-lg"
              />
              Username not found. Please try again.
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
              ><span class="heading--text">Reset password</span></v-btn
            >
          </v-form>
        </v-col>
      </v-row>
      <the-success-dialog
        subtitle="A new password has been sent to your email."
      />
    </v-container>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'
import TheSuccessDialog from '@/components/common/TheSuccessDialog'

export default {
  components: {
    TheLogo,
    TheSuccessDialog,
  },
  data() {
    return {
      loading: false,
      failed: false,
      username: '',
      valid: null,
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
      title: 'Reset password',
    }
  },
  methods: {
    async reset() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const url = new URL(
            '/.netlify/functions/resetPassword',
            this.$config.baseURL
          )
          const response = await fetch(url, {
            body: JSON.stringify({
              email: this.username,
            }),
            method: 'POST',
          })
          if (response.status === 400) {
            this.$rollbar.debug('Error resetting password')
            this.failed = true
          } else {
            this.$nuxt.$emit('show-success')
            this.failed = false
          }
        } catch (e) {
          console.error(e)
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
