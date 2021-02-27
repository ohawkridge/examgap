<template>
  <v-footer padless>
    <v-card id="foot-card" flat tile color="#292f36">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <p id="strapline" class="grey--text font-weight-bold pr-md-8 mb-0">
              Examgap
            </p>
            <p class="grey--text text-body-1 mb-10">
              Improve your Computer Science results
            </p>
            <p>
              <v-btn large color="primary" elevation="0" nuxt to="/trial">
                30-Day Free trial
              </v-btn>
            </p>
            <p class="text-h6 grey--text">Contact</p>
            <ul class="no-bullet">
              <li>
                <v-icon color="grey">{{ $icons.mdiEmailOutline }}</v-icon>
                <a
                  href="mailto:support@examgap.com"
                  class="text-decoration-none grey--text"
                  >support@examgap.com</a
                >
              </li>
              <li>
                <v-icon color="grey">{{ $icons.mdiTwitter }}</v-icon>
                <a
                  href="https://twitter.com/examgap"
                  class="text-decoration-none grey--text"
                  >@examgap</a
                >
              </li>
            </ul>
          </v-col>
          <v-col cols="12" md="4">
            <p class="text-h6 grey--text">Product</p>
            <ul class="no-bullet">
              <li>
                <nuxt-link to="/#how" class="text-decoration-none grey--text"
                  >How it works</nuxt-link
                >
              </li>
              <li>
                <nuxt-link to="/pricing" class="text-decoration-none grey--text"
                  >Pricing</nuxt-link
                >
              </li>
            </ul>
            <p class="text-h6 grey--text pt-4">Legal</p>
            <ul class="no-bullet">
              <li>
                <nuxt-link to="/terms" class="text-decoration-none grey--text"
                  >Terms of service</nuxt-link
                >
              </li>
              <li>
                <nuxt-link to="/privacy" class="text-decoration-none grey--text"
                  >Privacy</nuxt-link
                >
              </li>
              <li>
                <nuxt-link to="/gdpr" class="text-decoration-none grey--text"
                  >GDPR</nuxt-link
                >
              </li>
            </ul>
          </v-col>
          <v-col cols="12" md="4">
            <p class="text-h6 grey--text">Contact Us</p>
            <v-form ref="form">
              <v-text-field
                v-model="email"
                label="Your email*"
                outlined
                dark
                required
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <v-text-field
                v-model="name"
                label="Your name"
                outlined
                dark
              ></v-text-field>
              <v-textarea
                v-model="message"
                outlined
                dark
                label="Your message*"
                required
                :rules="[rules.required]"
              ></v-textarea>
              <small class="grey--text">*Indicates required field</small>
              <v-btn
                outlined
                :loading="loading"
                :disabled="loading"
                class="float-right"
                color="grey"
                @click="send()"
              >
                Send
                <v-icon right>{{ $icons.mdiSendOutline }}</v-icon>
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
        <v-divider dark class="py-2 mt-4" />
        <v-row>
          <v-col class="grey--text">
            Examgap&mdash;{{ new Date().getFullYear() }}. All rights reserved.
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <SuccessDialog
      title="Success. Message sent"
      subtitle="You should receive a response within 24 hours."
    />
  </v-footer>
</template>

<script>
import { mdiEmailOutline, mdiTwitter, mdiSendOutline } from '@mdi/js'
import SuccessDialog from '@/components/SuccessDialog'

export default {
  name: 'EgFooter',
  components: {
    SuccessDialog,
  },
  data() {
    return {
      email: '',
      name: '',
      message: '',
      loading: false,
      rules: {
        required: (value) => !!value || 'This field is required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
    }
  },
  created() {
    this.$icons = {
      mdiEmailOutline,
      mdiTwitter,
      mdiSendOutline,
    }
  },
  methods: {
    async send() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const response = await fetch(
          'https://examgap.com/.netlify/functions/sendEmail',
          {
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
              message: this.message,
              name: this.name,
            }),
            method: 'POST',
          }
        )
        if (!response.ok) {
          throw new Error(`Error sending email ${response.status}`)
        }
        this.$nuxt.$emit('show-modal')
        this.email = ''
        this.message = ''
        this.name = ''
        this.$refs.form.reset()
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
#foot-card {
  padding-top: 3em;
  width: 100%;
}

#strapline {
  font-size: 20px;
}

li {
  padding-bottom: 0.375em;
}
</style>
