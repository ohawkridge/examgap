<template>
  <v-dialog v-model="dialog" width="440">
    <template #activator="{ on: dial }">
      <v-tooltip bottom>
        <template #activator="{ on: tool }">
          <v-chip color="error" label class="mr-2" v-on="{ ...tool, ...dial }">
            <font-awesome-icon
              icon="fa-light fa-box-archive"
              class="mr-2 fa-lg"
            />
            Archived
            <font-awesome-icon
              icon="fa-light fa-circle-check"
              class="ml-2 fa-lg"
            />
          </v-chip>
        </template>
        <span>Restore class</span>
      </v-tooltip>
    </template>
    <v-card class="modal">
      <v-card-title class="d-flex justify-center">
        Restore class?
      </v-card-title>
      <v-card-text>
        <p>
          Restored classes can get new assignments and appear in the 'Classes'
          sidebar.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            elevation="0"
            rounded
            class="ml-2"
            @click="restore()"
          >
            Restore Class
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
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
        await this.$store.dispatch('user/restoreGroup', this.groupId)
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
