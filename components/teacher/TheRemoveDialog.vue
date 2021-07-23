<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal danger">
      <v-card-title class="d-flex justify-center">
        Remove student{{ selected.length | pluralize }}
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
        <v-btn color="error" elevation="0" @click="removeStudents()">
          Remove student{{ selected.length | pluralize }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TheRemoveDialog',
  props: {
    // An array of student object data from _students.vue
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
      loading: false,
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('open-remove')
  },
  mounted() {
    this.$nuxt.$on('open-remove', () => {
      this.dialog = true
    })
  },
  methods: {
    async removeStudents() {
      try {
        this.loading = true
        // Just get ids from student data objects
        const studentIds = this.selected.map((o) => o.id)
        await this.$store.dispatch('students/removeStudents', {
          groupId: this.groupId,
          studentIds,
        })
        this.$snack.showMessage({
          type: 'success',
          msg: `Student${this.selected.length !== 1 ? 's' : ''} removed`,
        })
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error removing student(s)',
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>
