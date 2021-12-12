<template>
  <v-card
    class="mb-6 rounded-lg outlined"
    outlined
    hover
    color="#ffffff"
    @click="nav()"
  >
    <v-card-title class="d-flex justify-space-between">
      {{ assignment.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text class="d-flex justify-space-between align-end">
      <div>
        <div>
          <span class="align-date font-weight-bold">Start:</span
          >{{ assignment.start | date }}
        </div>
        <div>
          <span class="align-date font-weight-bold">Due:</span
          >{{ assignment.dateDue | date }}
        </div>
      </div>
      <v-chip color="primary" outlined label small>
        {{ assignment.numQuestions }} question{{
          assignment.numQuestions | pluralize
        }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    courseName: {
      type: String,
      default: '',
    },
    assignment: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    // On /home, show group name
    // On /class, show course name
    subtitle() {
      return this.$route.name === 'home'
        ? this.assignment.group.name
        : this.courseName
    },
  },
  methods: {
    nav() {
      this.$router.push(`/assignment/${this.assignment.id}`)
    },
  },
}
</script>
