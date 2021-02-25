<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="9" md="8" lg="7" class="mt-md-10">
      <v-card class="pa-md-4">
        <v-card-title> Change password </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="oldPw"
              type="password"
              label="Old password*"
              :error-messages="fieldError"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="pass1"
              type="password"
              :rules="passwordRules"
              label="New password*"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="pass2"
              type="password"
              :rules="passwordRules"
              label="New password again*"
              required
              outlined
              :error-messages="match"
            ></v-text-field>
            <small>*Indicates required field</small>
            <v-btn
              color="primary"
              block
              type="submit"
              elevation="0"
              :disabled="typeof match == 'string' || loading"
              :loading="loading"
              @click="updatePass()"
              >Change Password</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      loading: false,
      oldPw: '',
      pass1: '',
      pass2: '',
      fieldError: [],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
    }
  },
  head() {
    return {
      title: 'Change password',
    }
  },
  computed: {
    match() {
      return this.pass1 === this.pass2 ? [] : 'Passwords do not match'
    },
  },
  methods: {
    async updatePass() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const url = new URL(
            '/.netlify/functions/updatePassword',
            'http://localhost:8888'
          )
          const response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              oldPass: this.oldPw,
              newPass: this.pass1,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error updating password ${response.status}`)
          }
          const data = await response.json()
          if (!data) {
            this.fieldError.push(`Old password incorrect`)
          } else {
            this.$snack.showMessage({
              msg: 'Success. Password updated',
              type: 'success',
            })
          }
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            msg: 'Error changing password',
            type: 'error',
          })
        } finally {
          this.$refs.form.reset()
          this.loading = false
        }
      }
    },
  },
}
</script>
