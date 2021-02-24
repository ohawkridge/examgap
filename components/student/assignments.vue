<template>
  <v-list>
    <v-list-item v-if="assignments.length === 0">
      <v-list-item-content>
        <v-list-item-title> No assignments yet </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-for="(assignment, i) in assignments"
      v-else
      :key="i"
      nuxt
      :to="`/assignment/${assignment.id}`"
    >
      <v-list-item-content>
        <v-list-item-title
          :class="assignment.live > 0 ? 'font-weight-bold' : ''"
          >{{ assignment.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          Due {{ assignment.dateDue | date }}
          <!-- <v-icon
              v-if="assignment.live >= 0 && assignment.live < 3"
              color="secondary"
              class="ml-2 pb-1"
            >
              {{ $icons.mdiAlarm }}
            </v-icon> -->
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>
          <v-chip label outlined>
            {{ assignment.questions.length }} question{{
              assignment.questions.length | pluralize
            }}</v-chip
          >
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'Assignments',
  props: {
    assignments: {
      type: Array,
      required: true,
    },
  },
}
</script>
