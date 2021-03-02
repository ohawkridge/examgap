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
        <v-list-item-title>
          {{ assignment.name }}
          <v-chip v-if="i === 0" class="ml-2" color="accent" small outlined>
            New
          </v-chip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="assignment.live >= 0 && assignment.live < 3"
                v-bind="attrs"
                color="accent"
                class="ml-2"
                v-on="on"
              >
                {{ $icons.mdiAlarm }}
              </v-icon>
            </template>
            <span
              >Due in {{ assignment.live }} day{{
                assignment.live | pluralize
              }}</span
            >
          </v-tooltip>
        </v-list-item-title>
        <v-list-item-subtitle>
          Due {{ assignment.dateDue | date }}
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
import { mdiAlarm } from '@mdi/js'

export default {
  name: 'Assignments',
  props: {
    assignments: {
      type: Array,
      required: true,
    },
  },
  created() {
    this.$icons = {
      mdiAlarm,
    }
  },
}
</script>
