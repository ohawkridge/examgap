<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on }">
      <v-btn rounded text color="red" v-on="on"> Delete </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-center">
        Delete assignment?
      </v-card-title>
      <v-card-text>
        <!-- TODO Does not work -->
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
  props: {
    assignmentId: {
      type: String,
      default: '',
    },
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
    async deleteAssignment() {
      try {
        this.loading = true
        console.log('Deleting', this.assignmentId)
        await this.$store.dispatch('user/deleteAssignment', this.assignmentId)
        // If on _report.vue, go back to _group.vue
        // Otherwise, stay put
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

<style scoped>
.ico-btn {
  height: 24px;
  width: 24px;
}
</style>
