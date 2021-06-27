<template>
  <v-card class="eg-card">
    <v-card-title> Assignments ({{ assignments.length }}) </v-card-title>
    <v-card-text>
      <template v-if="fetching">
        <div v-for="n in 4" :key="n" class="my-6">
          <v-skeleton-loader
            type="heading"
            height="21"
            class="mb-1"
            :loading="true"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="chip"
            :loading="true"
            class="float-right"
            style="position: relative; top: -26px"
          ></v-skeleton-loader>
          <v-skeleton-loader
            type="text"
            :loading="true"
            width="56%"
          ></v-skeleton-loader>
        </div>
      </template>
      <v-list v-else>
        <v-list-item v-if="assignments.length === 0" class="px-0 px-md-3">
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
          class="px-0 px-md-3"
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
              <div class="align-date">
                <span class="font-weight-bold">Start:</span>
                {{ assignment.start | date }}
              </div>
              <div class="align-date">
                <span class="font-weight-bold">Due:</span>
                {{ assignment.dateDue | date }}
              </div>
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
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiInformationOutline } from '@mdi/js'

export default {
  name: 'TheAssignmentsCard',
  props: {
    // $fetchState from home.vue
    fetching: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({ assignments: 'user/assignments' }),
  },
  created() {
    this.$icons = {
      mdiInformationOutline,
    }
  },
  methods: {
    chipText(n) {
      // Just show question count on mobile, otherwise pluralise
      if (this.$vuetify.breakpoint.name === 'xs') return ''
      return `question${n !== 1 ? 's' : ''}`
    },
  },
}
</script>
