<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal danger">
      <v-card-title class="d-flex justify-center">
        {{ `Remove student${selected.length !== 1 ? 's' : ''}?` }}
      </v-card-title>
      <v-card-text>
        <ul class="mb-4">
          <li v-for="(user, i) in selected" :key="i">{{ user.username }}</li>
        </ul>
        Are you sure? Removed students keep their accounts, but they won't
        appear in this class anymore.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> Cancel </v-btn>
        <v-btn color="error" elevation="0" @click="remove()">
          <v-icon left>
            {{ $icons.mdiMinusCircleOutline }}
          </v-icon>
          Remove students
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiMinusCircleOutline } from '@mdi/js'

export default {
  name: 'RemoveStudents',
  props: {
    selected: {
      type: Array,
      default: () => [],
    },
    groupId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  created() {
    this.$icons = {
      mdiMinusCircleOutline,
    }
  },
  mounted() {
    this.$nuxt.$on('open-remove', () => {
      this.dialog = true
    })
  },
  methods: {
    async remove() {
      const url = new URL(
        '/.netlify/functions/removeStudent',
        'http://localhost:8888'
      )
      try {
        for (const student of this.selected) {
          const response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              studentId: student.id,
              groupId: this.groupId,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(
              `Error fetching removing student(s) ${response.status}`
            )
          }
        }
        this.$snack.showMessage({
          type: 'success',
          msg: `Success. Student${
            this.selected.length !== 1 ? 's' : ''
          } removed`,
        })
        // Trigger re-fetch in parent to update data
        this.$nuxt.$emit('user-added')
      } catch (e) {
        console.error(e)
      } finally {
        this.dialog = false
      }
    },
  },
}
</script>
