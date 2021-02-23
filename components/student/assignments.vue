<template>
  <!-- <v-list>
    <template v-for="(assignment, i) in assignments">
      <v-list-item :key="i" nuxt :to="`/student/assignment/${assignment.id}`">
        <v-list-item-content>
          <v-list-item-title
            :class="assignment.live > 0 ? 'font-weight-medium' : ''"
            >{{ assignment.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Due {{ assignment.dateDue | date }}
            <v-icon
              v-if="assignment.live >= 0 && assignment.live < 3"
              color="secondary"
              class="ml-2 pb-1"
            >
              {{ $icons.mdiAlarm }}
            </v-icon>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            {{ assignment.questions.length }} question{{
              assignment.questions.length | pluralize
            }}
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </template>
    <v-list-item v-if="assignments.length === 0">
      <v-list-item-content>
        <v-list-item-title> No assignments yet </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list> -->
  <p class="red--text">a: {{ assignments }}</p>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  // Dispatch an action to get group's assignments
  async fetch({ store }) {
    await store.dispatch('assignments/getAssignments', this.group.id)
  },
  computed: {
    ...mapGetters({
      group: 'groups/activeGroup',
    }),
  },
}
</script>
