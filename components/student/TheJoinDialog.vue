<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Join class </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="code"
            :rules="codeRules"
            label="Class code*"
            placeholder="123-456"
            hint="Enter class code"
            outlined
            autofocus
            @input="formatCode"
          ></v-text-field>
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
          @click="join()"
        >
          Join class
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'JoinClass',
  data() {
    return {
      dialog: false,
      loading: false,
      groupName: '',
      codeRules: [
        (v) => (v && v.length === 7) || 'Code must be six digits',
        (v) => /\d{3}-\d{3}/gm.test(v) || 'Invalid class code',
      ],
      code: '',
    }
  },
  mounted() {
    this.$nuxt.$on('join-class', () => {
      this.dialog = true
    })
  },
  methods: {
    formatCode() {
      if (this.code && this.code.length > 3) {
        const newStr = this.code.replace(/-/g, '')
        this.code = `${newStr.slice(0, 3)}-${newStr.slice(3)}`
      }
    },
    async join() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const url = new URL(
            '/.netlify/functions/joinClass',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              code: this.code,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error joining class ${response.status}`)
          }
          response = await response.json()
          // Dispatch getUser action again
          this.$store.dispatch('user/getUser')
          this.$snack.showMessage({
            type: 'success',
            msg: `Class joined`,
          })
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            type: 'error',
            msg: `Error joining class`,
          })
        } finally {
          // Close dialog; clear form
          this.dialog = false
          this.loading = false
          this.$refs.form.reset()
        }
      }
    },
  },
}
</script>
