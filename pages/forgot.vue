<template>
  <v-app>
    <v-app-bar flat app color="white">
      <v-container class="d-flex align-center px-0 px-sm-3">
        <EgLogoIndex />
        <v-spacer />
        <span class="grey--text"
          >Back to <nuxt-link to="/">home</nuxt-link></span
        >
      </v-container>
    </v-app-bar>
    <v-container class="fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12" sm="8" md="6" lg="5" xl="4">
          <p class="text-h5 font-weight-bold text-center">
            Reset your password
          </p>
          <!-- Prevent submit btn posting form -->
          <v-form v-model="valid" @submit.prevent="reset()">
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
              Student? Ask your teacher to reset your password
            </v-alert>
            <v-alert
              v-if="failed"
              border="left"
              text
              dense
              type="error"
              :icon="$icons.mdiAlertOutline"
            >
              Username not found
            </v-alert>
            <v-btn
              color="primary"
              elevation="0"
              block
              large
              :loading="loading"
              :disabled="!valid || loading"
              type="submit"
              >Reset password</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
      <EgSuccessDialog
        title="Success. Password reset"
        subtitle="A new password has been sent to your email."
      />
    </v-container>
  </v-app>
</template>

<script>
// import EgLogoIndex from '@/components/EgLogoIndex'
// import EgSuccessDialog from '@/components/EgSuccessDialog'
// import { resetPassword } from '@/api'
// import EventBus from '@/plugins/eventBus.client'
import { mdiAlertOutline, mdiInformationOutline } from '@mdi/js'

export default {
  components: {
    // EgLogoIndex,
    // EgSuccessDialog,
  },
  data() {
    return {
      loading: false,
      failed: false,
      username: '',
      valid: null,
      show: false,
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
    // async reset() {
    //   this.loading = true
    //   const res = await resetPassword(this.username)
    //   console.log(res)
    //   if (res.name == 'NotFound') {
    //     this.failed = true
    //   } else {
    //     EventBus.$emit('show-modal')
    //     this.failed = false
    //     this.username = ''
    //   }
    //   this.loading = false
    // },
  },
}
</script>
