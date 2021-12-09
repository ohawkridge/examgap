<template>
  <v-dialog v-model="dialog" width="440" class="rounded-xl">
    <template #activator="{ on: dial }">
      <v-tooltip bottom>
        <template #activator="{ on: tool }">
          <v-btn
            text
            rounded
            color="error"
            class="mr-2"
            v-on="{ ...tool, ...dial }"
          >
            <font-awesome-icon
              icon="fa-light fa-box-archive"
              class="mr-2 fa-lg"
            />
            Archived
            <font-awesome-icon icon="fa-light fa-check" class="ml-2 fa-lg" />
          </v-btn>
        </template>
        <span>Restore</span>
      </v-tooltip>
    </template>
    <v-card class="rounded-xl" color="#fbfcff">
      <v-card-title> </v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">Restore class?</p>
        <p>
          Restored classes can get new assignments and appear in the 'Classes'
          menu.
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
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error archiving class`,
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>
