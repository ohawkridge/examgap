<template>
  <v-dialog v-model="dialog" max-width="440">
    <!-- Show full button on desktop; v-menu on mobile -->
    <template #activator="{ on }">
      <v-btn v-if="type === 'btn'" color="red" rounded text v-on="on">
        Delete
      </v-btn>
      <v-list-item v-else v-on="on">
        <v-list-item-title class="red--text"> Delete </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-center">
        Delete assignment?
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="deleteAssignment()">
          <p>
            This assignment and all the responses that go with it will be
            deleted. This action <em>cannot</em> be undone.
          </p>
          <div class="d-flex justify-end">
            <v-btn text rounded @click="dialog = false">Cancel</v-btn>
            <v-btn
              color="error"
              elevation="0"
              :loading="loading"
              :disabled="loading"
              rounded
              class="ml-2"
              type="submit"
            >
              Delete Assignment</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteAssignmentDialog',
  props: {
    assignmentId: {
      type: String,
      default: '',
    },
    groupId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'btn',
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
        // Go back to _group.vue
        this.$router.push(`/group/${this.groupId}`)
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

<style scoped>
.ico-btn {
  height: 24px;
  width: 24px;
}
</style>
