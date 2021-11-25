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
          <p class="text-h5 font-weight-bold text-center">Update Password</p>
          <v-form ref="form" @submit.prevent="updatePass()">
            <v-text-field
              v-model="pass1"
              type="password"
              :rules="passRules"
              label="New password* (min. 6 characters)"
              required
              validate-on-blur
              outlined
            ></v-text-field>
            <v-text-field
              v-model="pass2"
              type="password"
              :rules="passRules"
              label="New password again*"
              required
              validate-on-blur
              outlined
            ></v-text-field>
            <small>*Indicates required field</small>
            <v-btn
              color="primary"
              block
              type="submit"
              elevation="0"
              rounded
              :disabled="loading"
              :loading="loading"
              @click="updatePass()"
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
      loading: false,
      pass1: '',
      pass2: '',
      passRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
        (v) => this.pass1 === this.pass2 || 'Passwords must match',
      ],
    }
  },
  head() {
    return {
      title: 'Update Password',
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
              password: this.pass1,
              code: this.$route.query.c,
            }),
            method: 'POST',
          })
          response = await response.text()
          console.debug(response)
          // if (response === 'Email not found') {
          //   this.failed = true
          // } else {
          //   this.failed = false
          //   this.dialog = true
          // }
          // Log user in ?
          // await this.$store.dispatch('user/getUser', {
          //   username: this.username,
          //   password: this.pw,
          // })
          this.$router.push('/home')
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error updating password',
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
