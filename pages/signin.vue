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
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="5" xl="4" class="px-4">
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
              <nuxt-link to="/forgot">Reset password</nuxt-link>
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
      loginKey: '',
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
    // Try to login user with credentials
    async getUserSecret() {
      const url = new URL(
        '/.netlify/functions/getUserSecret',
        this.$config.baseURL
      )
      const response = await fetch(url, {
        body: JSON.stringify({
          username: this.username,
          password: this.pw,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Invalid credentials! ${response.status}`)
      } else {
        return await response.json()
      }
    },
    async login() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          // Using key, try to login
          const res = await this.getUserSecret()
          this.$store.commit('user/setSecret', res.secret)
          this.$router.push(res.teacher ? `/classes` : `/home`)
        } catch (e) {
          console.error(e)
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
