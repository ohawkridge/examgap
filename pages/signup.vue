<template>
  <v-app>
    <v-container class="d-flex align-center">
      <nuxt-link to="/">
        <TheLogo />
      </nuxt-link>
      <v-spacer />
      <nuxt-link to="/">Back home</nuxt-link>
    </v-container>
    <v-container class="fill-height">
      <v-row class="d-flex justify-center">
        <v-col id="nav-fix" cols="12" sm="8" md="6" lg="5" xl="4">
          <v-card flat>
            <v-form ref="form" @submit.prevent="signup()">
              <v-card-title
                class="text-h5 font-weight-bold d-flex justify-center"
              >
                Join Class
              </v-card-title>
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-card-text>
                    <v-text-field
                      v-model="code"
                      outlined
                      :rules="codeRules"
                      validate-on-blur
                      label="Class code"
                      placeholder="123-456"
                      autofocus
                      @input="formatCode"
                    >
                    </v-text-field>
                    <v-alert
                      v-if="invalidCode"
                      border="left"
                      text
                      dense
                      type="error"
                      :icon="$icons.mdiAlertOutline"
                    >
                      Invalid code. Please try again
                    </v-alert>
                  </v-card-text>
                </v-window-item>
                <v-window-item :value="2">
                  <v-card-text>
                    <v-row>
                      <v-col class="pb-0" cols="12">
                        <v-text-field
                          v-model="email"
                          outlined
                          validate-on-blur
                          :rules="emailRules"
                          label="School email*"
                          placeholder="17bloggsj@yourschool.org.uk"
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="pb-0" cols="12" md="6">
                        <v-text-field
                          v-model="pass1"
                          outlined
                          :rules="passwordRules"
                          validate-on-blur
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
                          validate-on-blur
                          type="password"
                          label="Confirm password*"
                          :error-messages="match"
                          required
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <small> *Indicates required field </small>
                    <p class="mt-2 mb-0">
                      By registering you accept our
                      <a href="/terms" target="_blank">terms of service</a>
                      <v-icon small>{{ $icons.mdiOpenInNew }}</v-icon
                      >.
                    </p>
                    <v-alert
                      v-if="emailInUse"
                      border="left"
                      text
                      dense
                      type="error"
                      :icon="$icons.mdiAlertOutline"
                    >
                      Email already registered.
                      <nuxt-link to="/signin">Sign in</nuxt-link> instead
                    </v-alert>
                  </v-card-text>
                </v-window-item>
              </v-window>
              <v-card-actions>
                <v-btn :disabled="step === 1" text @click="step--">
                  Back
                </v-btn>
                <v-spacer />
                <v-btn
                  v-if="step === 1"
                  elevation="0"
                  color="primary"
                  @click="next()"
                >
                  Next
                </v-btn>
                <v-btn
                  v-if="step === 2"
                  elevation="0"
                  :loading="loading"
                  :disabled="loading"
                  color="primary"
                  type="submit"
                >
                  Sign up
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'
import { mdiOpenInNew, mdiAlertOutline, mdiInformationOutline } from '@mdi/js'
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
        (v) => (v && v.length >= 4) || 'Password must be at least 4 characters',
      ],
      codeRules: [
        (v) => (v && v.length === 7) || 'Code must be six digits',
        (v) => /\d{3}-\d{3}/gm.test(v) || 'Invalid class code',
      ],
      loading: false,
      email: '',
      emailInUse: false,
      code: '',
      pass1: '',
      pass2: '',
      step: 1,
      invalidCode: false,
    }
  },
  head() {
    return {
      title: 'Sign up',
    }
  },
  computed: {
    match() {
      return this.pass1 === this.pass2 ? [] : "Passwords don't match"
    },
  },
  created() {
    this.$icons = {
      mdiOpenInNew,
      mdiAlertOutline,
      mdiInformationOutline,
    }
  },
  mounted() {
    // Get code from query string
    if (this.$route.query.code) this.code = this.$route.query.code
  },
  methods: {
    next() {
      if (this.code.length === 7 && /\d{3}-\d{3}/gm.test(this.code)) {
        this.step++
        this.invalidCode = false
        this.$refs.form.resetValidation()
      } else {
        this.invalidCode = true
      }
    },
    formatCode() {
      if (this.code.length > 3) {
        const newStr = this.code.replace(/-/g, '')
        this.code = `${newStr.slice(0, 3)}-${newStr.slice(3)}`
      }
    },
    async signup() {
      if (this.step === 2 && this.$refs.form.validate()) {
        this.loading = true
        try {
          const url = new URL(
            '/.netlify/functions/registerStudent',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              email: this.email,
              password: this.pass1,
              code: this.code,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error signing up ${response.status}`)
          }
          response = await response.json()
          console.log(
            '%c' + 'User',
            'padding:2px 4px;background-color:#0078a0;color:white;border-radius:3px'
          )
          console.dir(response)
          if (response === false) {
            this.emailInUse = true
          } else {
            const url2 = new URL(
              '/.netlify/functions/sendEmailWelcomeStudent',
              this.$config.baseURL
            )
            const mailResponse = await fetch(url2, {
              method: 'POST',
              mode: 'cors',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: response.data.username }),
            })
            if (!mailResponse.ok) {
              throw new Error(`Error sending email ${mailResponse.status}`)
            }
            // Complete the login process
            // Use email and password to try for secret
            const res = await this.getUser()
            this.$store.commit('user/setSecret', res.secret)
            this.$router.push(`/home`)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
      if (this.step === 1) {
        this.step = 2
      }
    },
    async getUser() {
      const url = new URL('/.netlify/functions/getUser', this.$config.baseURL)
      let response = await fetch(url, {
        body: JSON.stringify({
          username: this.email,
          password: this.pass1,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Invalid credentials! ${response.status}`)
      }
      response = await response.json()
      return response
    },
  },
}
</script>
