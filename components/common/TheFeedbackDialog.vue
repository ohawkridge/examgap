<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-icon>
          <v-icon>{{ $icons.mdiCommentAlertOutline }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Send Feedback</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- <template #activator="{ on: dial }">
      <v-tooltip bottom>
        <template #activator="{ on: tool }">
          <v-btn icon v-on="{ ...tool, ...dial }">
            <v-icon>{{ $icons.mdiCommentAlertOutline }}</v-icon>
          </v-btn>
        </template>
        <span>Send feedback</span>
      </v-tooltip>
    </template> -->
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Send feedback </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-textarea
            v-model="feedback"
            :rules="rules"
            label="Feedback*"
            auto-grow
            placeholder="Thanks for helping make Examgap better."
            outlined
            autofocus
          ></v-textarea>
        </v-form>
        <small>*Indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :loading="loading"
          :disabled="loading"
          @click="send()"
        >
          Send feedback
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiCommentAlertOutline } from '@mdi/js'
export default {
  data() {
    return {
      dialog: false,
      loading: false,
      feedback: '',
      rules: [(value) => !!value || 'This field is required.'],
    }
  },
  created() {
    this.$icons = {
      mdiCommentAlertOutline,
    }
  },
  methods: {
    async send() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          // Can't seem to execute FQL /and/ send email in one function
          // Record feedback in db
          let url = new URL(
            '/.netlify/functions/sendFeedback',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
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
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: 'Error sending feedback',
          })
        } finally {
          this.loading = false
          this.dialog = false
          this.$refs.form.reset()
        }
      }
    },
  },
}
</script>
