<template>
  <v-card class="eg-card">
    <v-card-title> Assignments ({{ assignments.length }}) </v-card-title>
    <v-card-text>
      <!-- Skeleton loaders -->
      <template v-if="loading">
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
      <!-- v-list of assignments  -->
      <v-list v-else>
        <v-list-item v-if="assignments.length === 0" class="px-0 px-md-3">
          <v-list-item-icon>
            <v-icon>{{ $icons.mdiInformationOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> No assignments yet </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-for="(assignment, i) in assignments" v-else>
          <v-list-item
            :key="i"
            class="px-0 px-md-3"
            nuxt
            :to="`/assignment/${assignment.id}`"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ assignment.name }}
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
                {{ assignment.questions.length }}
                {{ actionText(assignment.questions.length) }}
              </v-list-item-action-text>
              <!-- Due soon! -->
              <v-icon
                v-if="assignment.live > 0 && assignment.live < 3"
                color="accent"
              >
                {{ $icons.mdiTimerSand }}
              </v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-divider
            v-if="i < assignments.length - 1"
            :key="i + 999"
            class="my-2 mx-0 mx-sm-3"
          />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { mdiInformationOutline, mdiTimerSand } from '@mdi/js'

export default {
  name: 'TheAssignmentsCard',
  computed: {
    ...mapGetters({
      assignments: 'user/assignments',
    }),
    ...mapState({
      loading: (state) => state.app.loading,
    }),
  },
  created() {
    this.$icons = {
      mdiInformationOutline,
      mdiTimerSand,
    }
  },
  methods: {
    actionText(n) {
      // Show, for example, "5 Q" on mobile
      // and "5 Questions" on desktop
      if (this.$vuetify.breakpoint.name === 'xs') return 'Q'
      return `Question${n !== 1 ? 's' : ''}`
    },
  },
}
</script>
