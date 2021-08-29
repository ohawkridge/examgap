<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card>
      <v-card-title class="d-flex justify-center">
        Remove student{{ selected.length | pluralize }}?
      </v-card-title>
      <v-card-text>
        <ul class="mb-4">
          <li v-for="(user, i) in selected" :key="i">{{ user.username }}</li>
        </ul>
        <p>
          Removing a student won't delete their account, but they won't appear
          in this class anymore.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="error"
            elevation="0"
            rounded
            class="ml-2"
            :loading="loading"
            :disabled="loading"
            @click="removeStudents()"
          >
            Remove Student{{ selected.length | pluralize }}
          </v-btn>
        </div>
      </v-card-text>
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
        await this.$store.dispatch('group/removeStudents', studentIds)
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
