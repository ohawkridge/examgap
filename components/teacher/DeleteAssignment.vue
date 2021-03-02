<template>
  <v-dialog v-model="dialog" max-width="440">
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
    async deleteAssignment() {
      this.loading = true
      try {
        const url = new URL(
          '/.netlify/functions/deleteAssignment',
          'http://localhost:8888'
        )
        let response = await fetch(url, {
          body: JSON.stringify({
            secret: this.$store.state.user.secret,
            assignmentId: this.assignmentId,
          }),
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(`Error deleting assignment ${response.status}`)
        }
        response = await response.json()
        console.log(response)
        // If on assignment detail, go to /group/xxx, else stay put
        if (this.$route.name !== 'group-group') {
          this.$router.push(`/group/${this.groupId}`)
        }
        // Trigger fetch in parent
        this.$nuxt.$emit('refresh')
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
