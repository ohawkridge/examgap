<template>
  <v-app>
    <v-container class="d-flex align-center">
      <nuxt-link to="/">
        <TheLogo />
      </nuxt-link>
      <v-spacer />
      <span class="grey--text">Back to <nuxt-link to="/">home</nuxt-link></span>
    </v-container>
    <v-container class="fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col id="form" cols="12" sm="8" md="6" lg="5" xl="4">
          <p class="text-h5 font-weight-bold text-center">
            Reset your password
          </p>
          <!-- Prevent submit btn posting form -->
          <v-form ref="form" @submit.prevent="reset()">
            <v-text-field
              v-model="username"
              :prepend-inner-icon="$icons.mdiAccountOutline"
              label="Email"
              color="primary"
              type="text"
              required
              outlined
              :rules="userRules"
              autofocus
            ></v-text-field>
            <v-alert
              border="left"
              text
              dense
              type="info"
              :icon="$icons.mdiInformationOutline"
            >
              Student? Your teacher can reset your password
            </v-alert>
            <v-alert
              v-if="failed"
              border="left"
              text
              type="error"
              :icon="$icons.mdiAlertOutline"
            >
              Username not found. Please try again
            </v-alert>
            <v-btn
              color="primary"
              elevation="0"
              block
              large
              :loading="loading"
              :disabled="loading"
              type="submit"
              >Reset password</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
      <TheSuccessDialog
        title="Password reset"
        subtitle="A new password has been sent to your email."
      />
    </v-container>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'
import TheSuccessDialog from '@/components/common/TheSuccessDialog'
import { mdiAlertOutline, mdiInformationOutline } from '@mdi/js'

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
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'Invalid e-mail.'
        },
      ],
    }
  },
  head() {
    return {
      title: 'Reset your password',
    }
  },
  created() {
    this.$icons = {
      mdiAlertOutline,
      mdiInformationOutline,
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
          let response = await fetch(url, {
            body: JSON.stringify({
              email: this.username,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            this.$rollbar.debug('Error resetting password')
            // TODO Is this also needed?
            throw new Error(`Error resetting password ${response.status}`)
          }
          response = await response.json()
          if (response === false) {
            this.failed = true
          } else {
            this.failed = false
            this.$nuxt.$emit('show-success')
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
