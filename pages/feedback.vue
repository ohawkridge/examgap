<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="7" lg="5" class="mt-sm-6">
        <v-form ref="form">
          <div class="text-h5">Feedback</div>
          <p class="font-weight-light mb-9">
            Thanks for helping to make Examgap better.
          </p>
          <v-textarea
            v-model="feedback"
            :rules="rules"
            clearable
            label="Feedback*"
            auto-grow
            outlined
            autofocus
          ></v-textarea>
        </v-form>
        <small>*Indicates required field</small>
        <div>
          <v-btn
            color="primary"
            elevation="0"
            :loading="loading"
            :disabled="loading"
            rounded
            class="mt-2"
            @click="send()"
          >
            <span class="heading--text">Send</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      feedback: '',
      loading: false,
      rules: [(value) => !!value || 'This field is required.'],
    }
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Send feedback')
  },
  methods: {
    async send() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          // Can't execute query and send email in one function
          // Save feedback in db
          let url = new URL(
            '/.netlify/functions/sendFeedback',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              feedback: this.feedback,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error saving feedback ${response.status}`)
          }
          response = await response.json()
          // Send copy to me via email
          url = new URL(
            '/.netlify/functions/sendEmailFeedback',
            this.$config.baseURL
          )
          response = await fetch(url, {
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nameStr: response.data.user,
              message: this.feedback,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error sending email ${response.status}`)
          }
          this.$snack.showMessage({
            type: 'success',
            msg: 'Feedback sent',
          })
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error sending feedback',
          })
        } finally {
          this.loading = false
          this.dialog = false
          this.$refs.form.reset()
          this.$router.push('/home')
        }
      }
    },
  },
}
</script>
