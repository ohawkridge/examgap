<template>
  <v-dialog v-model="dialog" width="440">
    <template #activator="{ on }">
      <v-btn elevation="0" text rounded color="red" v-on="on">
        Archive class
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-center">
        Archive class?
      </v-card-title>
      <v-card-text>
        <p>
          Archived classes are moved to the 'Archive' section of the sidebar.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="red"
            :loading="loading"
            :disabled="loading"
            dark
            elevation="0"
            rounded
            class="ml-2"
            @click="archiveGroup()"
          >
            Archive Class
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
    async archiveGroup() {
      try {
        this.loading = true
        await this.$store.dispatch('user/archiveGroup')
        this.$snack.showMessage({
          type: 'success',
          msg: 'Class archived',
        })
        this.$router.push('/home')
      } catch (err) {
        console.error(err)
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
