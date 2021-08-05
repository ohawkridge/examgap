<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on }">
      <v-list-item v-if="type === 'item'" v-on="on">
        <v-list-item-content>
          <v-list-item-title class="red--text"> Delete </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-btn v-else text @click="dialog = true"> Delete </v-btn>
    </template>
    <v-card class="modal danger">
      <v-card-title class="d-flex justify-center">
        Delete assignment?
      </v-card-title>
      <v-card-text>
        Are you sure? This assignment and all the responses that go with it will
        be deleted. This action <em>cannot</em> be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="error"
          elevation="0"
          :loading="loading"
          :disabled="loading"
          @click="deleteAssignment()"
        >
          Delete Assignment</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    assignmentId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'item', // Show button or v-list-item?
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  methods: {
    async deleteAssignment() {
      try {
        this.loading = true
        await this.$store.dispatch('user/deleteAssignment', this.assignmentId)
        // If on assignment detail, go back to _group.vue
        if (this.$route.name !== 'group-group') {
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
