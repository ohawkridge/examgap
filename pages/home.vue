<template>
  <div>
    <!-- **TEACHER** -->
    <template v-if="teacher">
      <v-tabs
        v-model="tab"
        centered
        background-color="transparent"
        style="border-bottom: 1px solid #d2d2d2 !important"
      >
        <v-tab class="text-capitalize">Home</v-tab>
        <v-tab class="text-capitalize">Archive</v-tab>
      </v-tabs>
      <v-row class="pa-3">
        <template v-for="(group, i) in groups">
          <group-card
            v-if="group.active === (tab === 0 ? true : false)"
            :key="i"
            :group="group"
            :group-index="i"
          />
        </template>
        <the-create-class-card />
      </v-row>
    </template>
    <!-- **STUDENT** -->
    <template v-else>
      <v-tabs
        v-model="tab"
        centered
        background-color="transparent"
        style="border-bottom: 1px solid #d2d2d2 !important"
      >
        <v-tab class="text-capitalize">Assignments</v-tab>
        <v-tab class="text-capitalize">Revision</v-tab>
        <v-tab class="text-capitalize">Quote</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-list class="py-0">
            <v-list-item v-if="assignments.length === 0" class="divide">
              <v-list-item-content>
                <div class="d-flex align-center">
                  <div class="col1 font-weight-medium">No assignments yet.</div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(assignment, i) in assignments"
              v-else
              :key="i"
              nuxt
              :to="`/assignment/${assignment.id}`"
              class="divide"
            >
              <v-list-item-content>
                <div class="d-flex align-center">
                  <div class="col1">
                    <span class="font-weight-medium">{{
                      assignment.name
                    }}</span>
                    <div class="text-body-2">
                      {{ assignment.questions.length }} Question{{
                        assignment.questions.length | pluralize
                      }}
                    </div>
                  </div>
                  <div class="col2 d-flex align-center">
                    <v-icon class="mr-2">{{
                      $icons.mdiCalendarRangeOutline
                    }}</v-icon>
                    {{ assignment.start | date }}
                    <v-icon small class="mx-2">{{
                      $icons.mdiArrowRight
                    }}</v-icon>
                    {{ assignment.dateDue | date }}
                  </div>
                  <div class="col3 ml-auto">
                    <v-tooltip v-if="assignment.live" bottom>
                      <template #activator="{ on }">
                        <v-icon color="green" v-on="on">{{
                          $icons.mdiCircleOutline
                        }}</v-icon>
                      </template>
                      <span>Open</span>
                    </v-tooltip>
                    <v-tooltip v-else bottom>
                      <template #activator="{ on }">
                        <v-icon v-on="on">{{
                          $icons.mdiCheckCircleOutline
                        }}</v-icon>
                      </template>
                      <span>Complete</span>
                    </v-tooltip>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
        <v-tab-item> </v-tab-item>
        <v-tab-item>
          <the-quote-of-the-day />
        </v-tab-item>
      </v-tabs-items>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiPlus,
  mdiHomeOutline,
  mdiArchiveOutline,
  mdiCalendarRangeOutline,
  mdiArrowRight,
} from '@mdi/js'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'
import GroupCard from '@/components/teacher/GroupCard'
import TheCreateClassCard from '@/components/teacher/TheCreateClassCard'

export default {
  components: {
    TheQuoteOfTheDay,
    GroupCard,
    TheCreateClassCard,
  },
  layout: 'app',
  computed: {
    ...mapGetters({
      assignments: 'user/assignments',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
    }),
    // Remember active tab (in store)
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiHomeOutline,
      mdiArchiveOutline,
      mdiCalendarRangeOutline,
      mdiArrowRight,
    }
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Classes')
  },
}
</script>

<style scoped>
/* Assignment name (students) */
.col1 {
  width: 400px;
}

/* Dates */
.col2 {
  width: 240px;
}

.col3 {
  width: 24px;
}
</style>
