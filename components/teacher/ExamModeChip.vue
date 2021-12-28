<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-chip
        :color="student.examMode ? 'green' : ''"
        small
        class="ml-3"
        @click="toggleMode(student)"
        v-on="on"
      >
        Exam
        <font-awesome-icon
          :icon="student.examMode ? 'fa-light fa-check' : 'fa-light fa-ban'"
          class="ml-2"
        />
      </v-chip>
    </template>
    <span>Exam mode {{ student.examMode ? 'ON' : 'OFF' }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    student: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    async toggleMode(student) {
      try {
        const payload = {
          studentId: student.id,
          mode: !student.examMode,
        }
        await this.$store.dispatch('assignment/setExamMode', payload)
      } catch (err) {
        console.error(err)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error updating mode',
        })
      }
    },
  },
}
</script>
