<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal danger">
      <v-card-title class="text-h6 d-flex justify-center">
        {{ `Remove Student${selected.length > 1 ? 's' : ''}?` }}
      </v-card-title>
      <v-card-text>
        Are you sure? Removed students keep their accounts, but won't appear in
        this class anymore.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="removeModal = false"> Cancel </v-btn>
        <v-btn color="error" elevation="0" @click="remove()">
          <v-icon left>
            {{ $icons.mdiMinusCircleOutline }}
          </v-icon>
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RemoveStudents',
  props: {
    students: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    remove() {
      for (const studentId of this.students) {
        // const removedStudent = await removeStudent(
        //   student.id,
        //   this.$route.params.students
        // )
        console.log(`Removing`, studentId)
        // Remove student from this.students so ui in sync with db
        // for (let i = 0; i < this.students.length; i++) {
        //   if (this.students[i].id === student.id) {
        //     this.students.splice(i, 1)
        //   }
        // }
      }
    },
    //   this.$snack.showMessage({
    //     type: 'success',
    //     msg: `Success. Student${this.selected.length > 1 ? 's' : ''} removed`,
    //   })
    //   this.removeModal = false
    // },
  },
}
</script>
