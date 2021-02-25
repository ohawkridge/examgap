<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on }">
      <v-list-item v-if="type === 'item'" v-on="on">
        <v-list-item-content>
          <v-list-item-title> Delete </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-btn v-else text @click="dialog = true"> Delete </v-btn>
    </template>
    <v-card class="modal danger">
      <v-card-title class="d-flex justify-center">
        Delete assignment?
      </v-card-title>
      <v-card-text>
        Are you sure? This ssignment and all the responses that go with it will
        be deleted. This action cannot be undone.
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
          <v-icon left>{{ $icons.mdiDeleteForeverOutline }}</v-icon>
          Delete Assignment</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiDeleteForeverOutline } from '@mdi/js'

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
  created() {
    this.$icons = {
      mdiDeleteForeverOutline,
    }
  },
  methods: {
    deleteAssignment() {
      this.loading = true
      try {
        // await deleteAssignment(this.assignmentId)
        // If on assignment detail go to /group/xxx
        // If already on /group/xxx we can stay put
        // TODO - what route name?
        if (this.$route.name === 'teacher-assignment-assignment') {
          this.$router.push(`/group/${this.groupId}`)
        }
        // Update local data NOT NEEDED?
        // this.$store.commit('user/deleteAssignment', this.assignmentId)
        this.$snack.showMessage({
          msg: 'Success. Assignment deleted',
          type: 'success',
        })
      } catch (e) {
        console.warn(e)
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
