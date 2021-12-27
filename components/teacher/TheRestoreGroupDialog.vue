<template>
  <v-dialog v-model="dialog" width="440" class="rounded-xl">
    <template #activator="{ on }">
      <v-btn outlined color="primary" rounded v-on="on"> Restore class </v-btn>
    </template>
    <v-card class="rounded-xl">
      <v-card-title class="text-h5"> Restore class? </v-card-title>
      <v-card-text>
        <p>
          Restored classes appear in the 'CLASSES' menu and can receive new
          assignments.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            text
            rounded
            class="ml-2"
            @click="restore()"
          >
            Restore
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  methods: {
    async restore() {
      try {
        this.loading = true
        await this.$store.dispatch('user/restoreGroup')
        this.$snack.showMessage({
          type: 'success',
          msg: 'Class restored',
        })
        this.$router.push('/home')
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error restoring class`,
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>
