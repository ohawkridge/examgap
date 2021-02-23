<template>
  <v-app>
    <v-app-bar flat app color="white">
      <v-container class="d-flex align-center px-0 px-sm-3">
        <!-- <EgLogoIndex /> -->
        <v-spacer />
        <span class="grey--text"
          >Back to <nuxt-link to="/">home</nuxt-link></span
        >
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container id="trial" class="fill-height">
        <v-row class="d-flex justify-center">
          <v-col cols="12" sm="10" md="6">
            <p class="text-h4 text-center font-weight-bold mb-8">
              Register for your 30-day free trial
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
                required
              >
              </v-text-field>
              <v-alert
                v-if="emailInUse"
                border="left"
                text
                dense
                type="error"
                :icon="$icons.mdiAlertOutline"
              >
                Email is already registered
              </v-alert>
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
                <v-col class="pb-0" cols="12" md="6">
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
              <small> *Indicates required field </small>
              <p>
                By registering you accept our
                <a href="/terms" target="_blank">terms of service</a>
                <v-icon small>{{ $icons.mdiOpenInNew }}</v-icon
                >.
              </p>
              <v-btn
                color="primary"
                block
                large
                elevation="0"
                :loading="loading"
                :disabled="loading"
                type="submit"
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
// import EgLogoIndex from '@/components/EgLogoIndex'
// import registerTeacher from '@/api/teacher/registerTeacher'
// import { getUser, getLoginToken } from '@/api'
import { mdiOpenInNew, mdiAlertOutline } from '@mdi/js'
export default {
  components: {
    // EgLogoIndex,
  },
  data() {
    return {
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'Invalid e-mail.'
        },
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
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
  created() {
    this.$icons = {
      mdiOpenInNew,
      mdiAlertOutline,
    }
  },
  methods: {
    // async register() {
    //   if (this.$refs.form.validate()) {
    //     this.loading = true
    //     const res = await registerTeacher(this.school, this.email, this.pass1)
    //     if (res) {
    //       // Notify me via email
    //       fetch('https://examgap.com/.netlify/functions/sendEmailSignup', {
    //         method: 'POST',
    //         mode: 'cors',
    //         credentials: 'same-origin',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           id: res.ref.id,
    //           username: res.data.username,
    //           school: res.data.school,
    //         }),
    //       })
    //       // Send welcome email
    //       fetch('https://examgap.com/.netlify/functions/sendEmailWelcome', {
    //         method: 'POST',
    //         mode: 'cors',
    //         credentials: 'same-origin',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ username: res.data.username }),
    //       })
    //       // Complete the login process
    //       const token = await getLoginToken(res.data.username, this.pass1)
    //       localStorage.setItem('secret', token)
    //       const user = await getUser()
    //       this.$store.commit('user/setUser', user)
    //       this.$router.push('/teacher/home')
    //     } else {
    //       this.emailInUse = true
    //     }
    //     this.loading = false
    //   }
    // },
  },
}
</script>
