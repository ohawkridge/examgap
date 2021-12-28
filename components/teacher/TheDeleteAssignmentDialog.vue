<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-center text-h5 secondary--text pt-5">
        <font-awesome-icon icon="fa-light fa-trash-can-xmark" class="fa-sm" />
      </v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">Delete assignment?</p>
        <p>
          This assignment and all the responses that go with it will be deleted.
          This action <strong>cannot</strong> be undone.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="loading"
            :disabled="loading"
            text
            rounded
            class="ml-2"
            @click="deleteAssignment"
          >
            Delete
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TheDeleteAssignmentDialog',
  data() {
    return {
      dialog: false,
      loading: false,
      assignmentId: '',
      groupId: '',
    }
  },
  mounted() {
    this.$nuxt.$on('show-delete', (assignmentId, groupId) => {
      this.dialog = true
      this.assignmentId = assignmentId
      this.groupId = groupId
    })
  },
  methods: {
    async deleteAssignment() {
      try {
        this.loading = true
        await this.$store.dispatch('group/deleteAssignment', this.assignmentId)
        // If on /report/x, redirect to /group/x
        if (this.$route.name === 'report-report') {
          this.$router.push(`/group/${this.groupId}`)
        }
        this.$snack.showMessage({
          type: 'success',
          msg: 'Assignment deleted',
        })
      } catch (err) {
        console.warn(err)
        this.$snack.showMessage({
          msg: 'Error deleting assignment',
          type: 'error',
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>
