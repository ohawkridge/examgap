<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>{{ $icons.mdiCommentAlertOutline }}</v-icon>
      </v-btn>
    </template>
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
          const url = new URL(
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
            throw new Error(`Error sending feedback ${response.status}`)
          }
          response = await response.json()
          console.log(response)
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
