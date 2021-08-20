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
        <v-tab>Home</v-tab>
        <v-tab>Archive</v-tab>
      </v-tabs>
      <!-- N.B. v-tab-items not needed; tabs filter one data -->
      <v-list class="py-0">
        <template v-for="(group, i) in groups">
          <v-list-item
            v-if="group.active === (tab === 0 ? true : false)"
            :key="i"
            class="divide"
            @click="navTo(group.id)"
          >
            <v-list-item-content>
              <div class="d-flex align-center">
                <div class="col1 font-weight-medium">
                  {{ group.name }}
                  <div class="text-body-2">
                    {{ group.course.name }} ({{ group.course.board }})
                  </div>
                </div>
                <div class="col2 d-flex align-center">
                  <v-chip label outlined small>
                    {{ group.count }} student{{ group.count | pluralize }}
                  </v-chip>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </template>
    <!-- **STUDENT** -->
    <template v-else>
      <v-tabs
        v-model="tab"
        centered
        background-color="transparent"
        style="border-bottom: 1px solid #d2d2d2 !important"
      >
        <v-tab>Assignments</v-tab>
        <v-tab>Revision</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <!-- Skeletons -->
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
          <v-list v-else class="py-0">
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
              <v-list-item-content class="py-4">
                <div class="d-flex align-center">
                  <div class="col1">
                    <span class="font-weight-medium">{{
                      assignment.name
                    }}</span>
                    <div class="text-body-2">
                      {{ assignment.num_questions }} Question{{
                        assignment.num_questions | pluralize
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
        <v-tab-item>
          <v-list class="py-0">
            <v-list-item
              v-for="(topic, i) in topics"
              :key="i"
              class="divide"
              @click="revise(topic.id)"
            >
              <v-list-item-content>
                <div class="d-flex align-center">
                  <div id="r-col1" class="font-weight-medium">
                    {{ topic.name }}
                  </div>
                  <div>
                    <v-icon color="grey">{{ $icons.mdiCircleOutline }}</v-icon>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
      <the-revision-mode-dialog />
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
  mdiCircleOutline,
} from '@mdi/js'
import TheRevisionModeDialog from '@/components/student/TheRevisionModeDialog'

export default {
  components: {
    TheRevisionModeDialog,
  },
  layout: 'app',
  computed: {
    ...mapGetters({
      assignments: 'user/assignments',
      group: 'user/activeGroup',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
      loading: (state) => state.app.loading,
      topics: (state) => state.topics.topics,
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
      mdiCircleOutline,
    }
  },
  mounted() {
    // For students, the home page is the first
    // class in the student's classes menu
    if (this.teacher) {
      this.$store.commit('app/setPageTitle', 'Classes')
    } else {
      this.$store.commit('app/setPageTitle', this.group.name)
    }
  },
  methods: {
    navTo(groupId) {
      this.$store.commit('students/clearStudents')
      this.$store.commit('user/setActiveGroupIndex', this.groupIndex)
      this.$router.push(`/group/${groupId}`)
    },
    revise(topicId) {
      // Store topic id to increment count later
      this.$store.commit('topics/setTopicId', topicId)
      this.$nuxt.$emit('show-revise')
    },
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

/* Revision */
#r-col1 {
  width: 340px;
}
</style>
