<template>
  <v-app>
    <v-container class="d-flex align-center">
      <Logo />
      <v-spacer />
      <span class="grey--text">Back to <nuxt-link to="/">home</nuxt-link></span>
    </v-container>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col id="form" cols="12" sm="8" md="6" lg="5" xl="4" class="px-4">
          <p class="text-h5 font-weight-bold text-center">Sign In</p>
          <!-- Prevent submit btn posting form -->
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
              @click="login"
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
import Logo from '@/components/common/Logo'
import {
  mdiAccountOutline,
  mdiAlertOutline,
  mdiLockOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
} from '@mdi/js'

export default {
  components: {
    Logo,
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
      const response = await fetch('/.netlify/functions/getUserSecret', {
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
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        // Using key, try login
        this.getUserSecret()
          .then((res) => {
            this.$store.commit('user/setSecret', res.secret)
            this.$router.push('/home')
          })
          .catch((e) => {
            console.error(e)
            this.failed = true
            this.$refs.form.resetValidation()
            this.loading = false
          })
      }
    },
  },
}
</script>

<style scoped>
/* account for app-bar height */
#form {
  position: relative;
  top: -64px;
}
</style>
