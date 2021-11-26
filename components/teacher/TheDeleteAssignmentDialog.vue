<template>
  <v-dialog v-model="dialog" max-width="440">
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      groups: 'user/activeGroup',
    }),
  },
  beforeDestroy() {
    this.$nuxt.$off('show-delete')
  },
  mounted() {
    this.$nuxt.$on('show-delete', () => {
      this.dialog = true
    })
  },
  methods: {
    async deleteAssignment() {
      try {
        this.loading = true
        await this.$store.dispatch('user/deleteAssignment', this.assignmentId)
        // For _report.vue only, go back to _group.vue
        if (this.$route.name === 'report-report') {
          this.$router.push(`/group/${this.group.id}`)
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
