<template>
  <v-dialog v-model="dialog" max-width="440" class="rounded-xl">
    <v-card class="rounded-xl">
      <v-card-title
        class="d-flex justify-center text-h5 secondary--text mb-1 pt-5"
      >
        <font-awesome-icon icon="fa-light fa-users" class="fa-sm" />
      </v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">Join class</p>
        <v-text-field
          v-model="code"
          :rules="codeRules"
          label="Class code*"
          placeholder="123-456"
          outlined
          autofocus
          @input="formatCode"
        ></v-text-field>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            rounded
            text
            class="ml-2"
            @click="join()"
          >
            Join
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TheJoinClassDialog',
  data() {
    return {
      dialog: false,
      loading: false,
      codeRules: [
        (v) => (v && v.length === 7) || 'Code must be six digits',
        (v) => /\d{3}-\d{3}/gm.test(v) || 'Invalid class code',
      ],
      code: '',
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('show-join')
  },
  mounted() {
    this.$nuxt.$on('show-join', () => {
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
      try {
        this.loading = true
        await this.$store.dispatch('user/joinClass')
        this.$snack.showMessage({
          type: 'success',
          msg: `Class joined`,
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error joining class`,
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>
