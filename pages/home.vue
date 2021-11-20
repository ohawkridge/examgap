<template>
  <div>
    <!-- **TEACHER** -->
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
            <!-- TODO Finish -->
            <template v-if="loading">
              <v-card
                v-for="i in 3"
                :key="i"
                height="152"
                outlined
                class="mb-4"
              >
                <v-skeleton-loader type="heading" :loading="true" class="pa-3">
                </v-skeleton-loader>
              </v-card>
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
        <!-- Assignments -->
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
            <v-list-item v-if="group.assignments.length === 0" class="divide">
              <v-list-item-content>
                <div class="d-flex align-center">
                  <div class="col1 font-weight-medium">No assignments yet.</div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(assignment, i) in group.assignments"
              v-else
              :key="i"
              nuxt
              :to="`/assignment/${assignment.id}`"
              class="divide"
            >
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" sm="4" class="pb-0 pb-sm-3">
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ assignment.name }}
                    </div>
                    <div class="text-body-2 grey--text text--darken-2">
                      {{ assignment.num_questions }} Question{{
                        assignment.num_questions | pluralize
                      }}
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    class="
                      d-flex
                      flex-column flex-sm-row
                      align-center
                      text-body-2
                    "
                  >
                    <div class="justify-date left">
                      <span class="font-weight-medium fix-date mr-1"
                        >Start:</span
                      >
                      {{ assignment.start | date }}
                    </div>
                    <div class="left">
                      <span class="font-weight-medium fix-date mr-1">Due:</span>
                      {{ assignment.dateDue | date }}
                    </div>
                  </v-col>
                  <v-col
                    v-if="$vuetify.breakpoint.name !== 'xs'"
                    cols="2"
                    sm="2"
                    class="d-flex justify-center align-center"
                  >
                    <v-chip v-if="assignment.live" color="green" small>
                      Open
                      <font-awesome-icon
                        icon="fa-light fa-hourglass"
                        class="ml-2"
                      />
                    </v-chip>
                    <v-chip v-else small>
                      Past
                      <font-awesome-icon
                        icon="fa-light fa-hourglass-end"
                        class="ml-2"
                      />
                    </v-chip>
                  </v-col>
                </v-row>
              </v-list-item-content>
              <!-- item-action mobile only -->
              <v-list-item-action v-if="$vuetify.breakpoint.name === 'xs'">
                <v-list-item-action-text>
                  <template v-if="assignment.live"> Open </template>
                  <template v-else> Past </template>
                </v-list-item-action-text>
                <template v-if="assignment.live">
                  <font-awesome-icon
                    icon="fa-light fa-hourglass"
                    class="ico-green fa-lg"
                  />
                </template>
                <template v-else>
                  <font-awesome-icon
                    icon="fa-light fa-hourglass-end"
                    class="ico-grey fa-lg"
                  />
                </template>
              </v-list-item-action>
            </v-list-item>
          </v-list>
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
                      <div id="r-col1" class="font-weight-medium" v-on="on">
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

export default {
  components: {
    TheRevisionModeDialog,
    TeacherAssignmentCard,
  },
  layout: 'app',
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

<style scoped>
.chip-col {
  width: 94px;
}

/* Assignment name */
.col1 {
  width: 300px;
}

/* Start/Due */
.col2 {
  width: 190px;
}

/* Open/closed */
.col3 {
  width: 80px;
}

/* Revision */
#r-col1 {
  width: 340px;
}

@media only screen and (min-width: 600px) {
  .justify-date {
    width: 190px;
  }
}

/* Align Start/Due left in flex-columns */
@media only screen and (max-width: 600px) {
  .left {
    margin-right: auto;
  }
}
</style>
