<template>
  <div>
    <!-- Teacher xx -->
    <template v-if="teacher">
      <v-container>
        <v-row class="justify-center">
          <v-col cols="12" md="10" class="pt-10">
            <p class="text-h5">
              <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
              Add assignment for&hellip;
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="10" class="d-flex justify-start pb-10">
            <template v-for="(group, i) in groups">
              <v-tooltip :key="i" bottom>
                <template #activator="{ on }">
                  <v-btn
                    elevation="0"
                    large
                    rounded
                    outlined
                    color="primary darken-1"
                    class="mr-4"
                    @click="addAssign(group)"
                    v-on="on"
                  >
                    {{ group.name }}
                  </v-btn>
                </template>
                <span>Add assignment</span>
              </v-tooltip>
            </template>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="10">
            <p class="text-h5">
              <font-awesome-icon
                icon="fa-light fa-clock-rotate-left"
                class="mr-2"
              />
              Recent assignments
            </p>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="9">
            <!-- Skeletons -->
            <template v-if="loading">
              <v-sheet v-for="i in 3" :key="i" elevation="1" class="pa-4 mb-4">
                <v-skeleton-loader
                  type="heading"
                  class="mt-2"
                  :loading="true"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="text"
                  :loading="true"
                  width="20%"
                  class="mt-3"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="text"
                  :loading="true"
                  width="35%"
                  class="mt-8"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="text"
                  :loading="true"
                  width="35%"
                  class="mt-3"
                ></v-skeleton-loader>
              </v-sheet>
            </template>
            <template v-for="(assignment, i) in recent" v-else>
              <teacher-assignment-card :key="i" :assignment="assignment" />
            </template>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" md="10">
            <p class="text-h5">
              <font-awesome-icon icon="fa-light fa-chart-line" class="mr-2" />
              Stats
            </p>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <!-- Student xx -->
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
        <!-- Assignments -->
        <v-tab-item>
          <v-container>
            <v-row class="justify-center">
              <v-col cols="12" md="10">
                <v-btn-toggle
                  v-model="upcoming"
                  color="primary"
                  mandatory
                  borderless
                >
                  <v-btn> Upcoming </v-btn>
                  <v-btn min-width="110"> Past </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="12" md="10">
                <!-- Skeletons -->
                <template v-if="loading">
                  <v-sheet
                    v-for="i in 3"
                    :key="i"
                    elevation="1"
                    class="pa-4 mb-4"
                  >
                    <v-skeleton-loader
                      type="heading"
                      class="mt-2"
                      :loading="true"
                    ></v-skeleton-loader>
                    <v-skeleton-loader
                      type="text"
                      :loading="true"
                      width="20%"
                      class="mt-3"
                    ></v-skeleton-loader>
                    <v-skeleton-loader
                      type="text"
                      :loading="true"
                      width="35%"
                      class="mt-8"
                    ></v-skeleton-loader>
                    <v-skeleton-loader
                      type="text"
                      :loading="true"
                      width="35%"
                      class="mt-3"
                    ></v-skeleton-loader>
                  </v-sheet>
                </template>
                <student-assignment-card
                  v-for="(assignment, i) in assignments"
                  v-else
                  :key="i"
                  :assignment="assignment"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- Revision -->
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
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <div class="font-weight-medium" v-on="on">
                        {{ topic.name }}
                      </div>
                    </template>
                    <span>Click to revise</span>
                  </v-tooltip>
                  <div>
                    <font-awesome-icon
                      v-for="j in topic.answered"
                      :key="j"
                      icon="fa-light fa-circle-check"
                      class="ico-green fa-lg mr-2"
                    />
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
import TheRevisionModeDialog from '@/components/student/TheRevisionModeDialog'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'
import StudentAssignmentCard from '~/components/student/StudentAssignmentCard.vue'

export default {
  components: {
    TheRevisionModeDialog,
    TeacherAssignmentCard,
    StudentAssignmentCard,
  },
  layout: 'app',
  data() {
    return {
      upcoming: 0,
    }
  },
  computed: {
    ...mapGetters({
      recent: 'user/recentAssignments',
      group: 'user/activeGroup',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      groups: (state) => state.user.groups,
      loading: (state) => state.app.loading,
      topics: (state) => state.topics.topics,
    }),
    assignments() {
      return this.group.assignments.filter((a) => a.live === !this.upcoming)
    },
    // Remember active tab
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
  },
  mounted() {
    this.$store.commit(
      'app/setPageTitle',
      this.teacher ? 'Home' : this.group.name
    )
  },
  methods: {
    addAssign(group) {
      this.$store.commit('user/setActiveGroupId', group.id)
      this.$store.commit('topics/clearSelectedQuestions')
      this.$router.push(`/course/${group.course.id}`)
    },
    revise(topicId) {
      this.$store.commit('topics/setTopicId', topicId)
      this.$nuxt.$emit('show-revise')
    },
  },
}
</script>
