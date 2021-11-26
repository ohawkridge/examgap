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
          <p class="text-h5 font-weight-bold text-center">
            Choose a new password
          </p>
          <v-form ref="form" @submit.prevent="updatePass()">
            <v-text-field
              v-model="password"
              :rules="passRules"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? '$eyeSlash' : '$eye'"
              label="New password* (min. 6 characters)"
              required
              outlined
              @click:append="show = !show"
            >
              <font-awesome-icon
                slot="prepend-inner"
                icon="fa-light fa-lock-keyhole"
                class="fa-lg"
              />
            </v-text-field>
            <small>*Indicates required field</small>
            <v-alert v-if="failed" border="left" text type="error" dense>
              {{ message }}
            </v-alert>
            <v-btn
              color="primary"
              block
              type="submit"
              elevation="0"
              rounded
              :disabled="loading"
              :loading="loading"
              >Update Password</v-btn
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
      password: '',
      show: false,
      passRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
      loading: false,
      failed: false,
      message: '',
    }
  },
  head() {
    return {
      title: 'Choose a new password',
    }
  },
  methods: {
    async updatePass() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const url = new URL(
            '/.netlify/functions/resetPassword',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              password: this.password,
              code: this.$route.query.c,
            }),
            method: 'POST',
          })
          response = await response.text()
          if (response === 'Invalid code') {
            this.message = 'Reset link not valid. Please try again'
            this.failed = true
          } else if (response === 'Code expired') {
            this.message = 'Reset link expired. Please try again'
            this.failed = true
          } else {
            // Code is ok. Go to custom sign in page
            this.$router.push('/reset-signin')
          }
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error updating password',
          })
        } finally {
          this.loading = false
          this.username = ''
        }
      }
    },
  },
}
</script>
