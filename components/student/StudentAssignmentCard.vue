<template>
  <v-card
    class="mb-4 rounded-lg outlined"
    outlined
    hover
    color="#ffffff"
    @click="nav()"
  >
    <v-card-title class="d-flex justify-space-between">
      {{ assignment.name }}
    </v-card-title>
    <v-card-subtitle>
      <!-- {{ assignment.numQuestions }} question{{
        assignment.numQuestions | pluralize
      }} -->
    </v-card-subtitle>
    <v-card-text class="text-body-1">
      <div>
        <span class="align-date font-weight-bold">Start:</span
        >{{ assignment.start | date }}
      </div>
      <div>
        <span class="align-date font-weight-bold">Due:</span
        >{{ assignment.dateDue | date }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    assignment: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    nav() {
      this.$router.push(`/assignment/${this.assignment.id}`)
    },
  },
}
</script>

<style scoped>
.align-date {
  display: inline-block;
  width: 56px;
}
@media only screen and (max-width: 600px) {
  .align-date {
    display: inline-block;
    width: 60px;
  }
}

.outlined {
  border-color: #d2d2d2 !important;
}
</style>
