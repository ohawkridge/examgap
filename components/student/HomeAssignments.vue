<template>
  <v-list>
    <v-list-item v-if="assignments.length === 0">
      <v-list-item-icon>
        <v-icon>{{ $icons.mdiInformationOutline }}</v-icon>
      </v-list-item-icon>
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
          <v-chip
            v-if="assignment.live > 0 && assignment.live < 3"
            class="ml-2"
            color="accent"
            x-small
            outlined
          >
            Soon
          </v-chip>
        </v-list-item-title>
        <v-list-item-subtitle>
          Due {{ assignment.dateDue | date }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>
          <v-chip outlined>
            {{ assignment.questions.length }}
            {{ chipText(assignment.questions.length) }}
          </v-chip>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js'

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
      mdiInformationOutline,
    }
  },
  methods: {
    chipText(l) {
      if (this.$vuetify.breakpoint.name === 'xs') return ''
      return l === 1 ? 'question' : 'questions'
    },
  },
}
</script>
