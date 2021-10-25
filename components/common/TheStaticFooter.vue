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
              <v-btn
                large
                rounded
                color="#F4D06F"
                elevation="0"
                nuxt
                to="/trial"
              >
                30-Day Free trial
              </v-btn>
            </p>
            <p class="text-h6 grey--text">Contact</p>
            <ul class="no-bullet">
              <li>
                <font-awesome-icon
                  icon="fa-light fa-paper-plane"
                  class="ico-grey mr-1"
                />
                <a href="mailto:support@examgap.com" class="grey--text"
                  >support@examgap.com</a
                >
              </li>
              <li style="display: inline-block">
                <img id="twit" src="/twitter.svg" width="16" class="mr-1" />
                <a href="https://twitter.com/examgap" class="grey--text"
                  >examgap</a
                >
              </li>
            </ul>
          </v-col>
          <v-col cols="12" md="4">
            <p class="text-h6 grey--text">Product</p>
            <ul class="no-bullet">
              <li>
                <a href="https://examgap.blog" class="grey--text">Blog</a>
              </li>
              <li>
                <nuxt-link to="/#how" class="grey--text"
                  >How does it work?</nuxt-link
                >
              </li>
              <li>
                <nuxt-link to="/pricing" class="grey--text">Pricing</nuxt-link>
              </li>
            </ul>
            <p class="text-h6 grey--text pt-4">Legal</p>
            <ul class="no-bullet">
              <li>
                <nuxt-link to="/terms" class="grey--text"
                  >Terms of service</nuxt-link
                >
              </li>
              <li>
                <nuxt-link to="/privacy" class="grey--text">Privacy</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/gdpr" class="grey--text">GDPR</nuxt-link>
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
                type="email"
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
                rounded
                class="float-right"
                color="grey"
                @click="send()"
              >
                Send
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
        <v-divider dark class="py-2 mt-4" />
        <v-row>
          <v-col class="grey--text text-body-2">
            Examgap&mdash;{{ new Date().getFullYear() }}. All rights reserved
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <TheSuccessDialog
      title="Message sent"
      subtitle="You should receive a response within 24 hours."
    />
  </v-footer>
</template>

<script>
import TheSuccessDialog from '@/components/common/TheSuccessDialog'

export default {
  name: 'StaticFooter',
  components: {
    TheSuccessDialog,
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
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
    }
  },
  methods: {
    async send() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true
          const url = new URL(
            '/.netlify/functions/sendEmail',
            this.$config.baseURL
          )
          const response = await fetch(url, {
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
          })
          if (!response.ok) {
            throw new Error(`Error sending email ${response.status}`)
          }
          this.$nuxt.$emit('show-success')
          this.$refs.form.reset()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
        this.$refs.form.resetValidation()
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

#twit {
  position: relative;
  top: 4px;
}
</style>
