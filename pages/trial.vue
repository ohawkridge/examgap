<template>
  <v-app>
    <v-container class="d-flex align-center">
      <nuxt-link to="/">
        <the-logo />
      </nuxt-link>
      <v-spacer />
      <span class="grey--text"
        >Student? <nuxt-link to="/signup">Join class</nuxt-link></span
      >
    </v-container>
    <v-main>
      <v-container class="fill-height mt-md-n6">
        <v-row class="d-flex justify-center">
          <v-col cols="12" sm="10" md="7" lg="6">
            <p class="text-h4 text-center font-weight-bold mb-md-8">
              Register for your free trial
            </p>
            <v-form ref="form" @submit.prevent="register()">
              <p class="font-weight-bold">Your school</p>
              <v-text-field
                v-model="school"
                label="School name"
                color="primary"
                type="text"
                outlined
                autofocus
              ></v-text-field>
              <p class="font-weight-bold">Your account</p>
              <v-text-field
                v-model="email"
                outlined
                :rules="emailRules"
                label="Email*"
                type="email"
                required
              >
              </v-text-field>
              <v-row>
                <v-col class="pb-0" cols="12" md="6">
                  <v-text-field
                    v-model="pass1"
                    outlined
                    :rules="passwordRules"
                    type="password"
                    label="Create password*"
                    required
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="pass2"
                    outlined
                    :rules="passwordRules"
                    type="password"
                    label="Confirm password*"
                    :error-messages="match"
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-alert v-if="emailInUse" border="top" text type="error">
                <font-awesome-icon
                  slot="prepend"
                  icon="fa-light fa-circle-exclamation"
                  class="mr-2 fa-lg"
                />
                Email is already registered.
              </v-alert>
              <small> *Indicates required field </small>
              <p class="mt-2">
                By registering you accept our
                <a href="/terms" target="_blank">terms of service</a>
                <font-awesome-icon
                  icon="fa-light fa-arrow-up-right-from-square"
                  class="fa-sm"
                />.
              </p>
              <v-btn
                color="primary"
                block
                large
                rounded
                elevation="0"
                :loading="loading"
                :disabled="loading"
                type="submit"
                class="heading--text"
                >Register</v-btn
              >
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
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
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'Invalid e-mail.'
        },
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
      ],
      loading: false,
      school: '',
      email: '',
      emailInUse: false,
      pass1: '',
      pass2: '',
    }
  },
  head() {
    return {
      title: 'Register',
    }
  },
  computed: {
    match() {
      return this.pass1 === this.pass2 ? [] : 'Passwords do not match'
    },
  },
  methods: {
    async register() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const url = new URL(
            '/.netlify/functions/registerTeacher',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              school: this.school,
              password: this.pass1,
              username: this.email,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error registering for trial ${response.status}`)
          }
          response = await response.json()
          if (response === false) {
            this.emailInUse = true
          } else {
            // Notify me via email
            const url = new URL(
              '/.netlify/functions/sendEmailSignup',
              this.$config.baseURL
            )
            const res1 = await fetch(url, {
              method: 'POST',
              mode: 'cors',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: response.ref['@ref'].id,
                username: response.data.username,
                school: response.data.school,
              }),
            })
            if (!res1.ok) {
              throw new Error(`Error sending email ${response.status}`)
            }
            // Send welcome email
            const url2 = new URL(
              '/.netlify/functions/sendEmailWelcome',
              this.$config.baseURL
            )
            const res2 = await fetch(url2, {
              method: 'POST',
              mode: 'cors',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username: response.data.username }),
            })
            if (!res2.ok) {
              throw new Error(`Error sending email ${response.status}`)
            }
            // Complete the login process
            await this.$store.dispatch('user/getUser', {
              username: this.email,
              password: this.pass1,
            })
            this.$router.push(`/home`)
          }
        } catch (err) {
          console.error(err)
        } finally {
          this.$refs.form.resetValidation()
          this.loading = false
        }
      }
    },
  },
}
</script>
