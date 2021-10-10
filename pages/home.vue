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
      <!-- Home -->
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-list v-if="activeGroups.length > 0" class="py-0">
            <v-list-item
              v-for="(group, i) in activeGroups"
              :key="i"
              class="divide"
              @click="navTo(group.id)"
            >
              <!-- Can't force v-list-item-content to flex -->
              <v-list-item-content>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ group.name }}
                    </div>
                    <div class="text-body-2 grey--text text--darken-2">
                      {{ group.course.name }} ({{ group.course.board }})
                    </div>
                  </div>
                  <div class="chip-col d-flex justify-center">
                    <v-chip label outlined small>
                      {{ group.count }} student{{ group.count | pluralize }}
                    </v-chip>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <!-- Empty state -->
          <template v-else>
            <div class="d-flex justify-center pa-3">
              <v-img
                src="/no-class.svg"
                contain
                :max-width="$vuetify.breakpoint.name === 'xs' ? '50%' : '20%'"
                alt="Empty chair illustration"
              />
            </div>
            <p class="text-center mt-2">No classes yet.</p>
            <div class="d-flex justify-center">
              <v-btn
                elevation="0"
                rounded
                color="primary"
                @click="$nuxt.$emit('show-create')"
              >
                <font-awesome-icon icon="fa-light fa-plus mr-2" />
                Class
              </v-btn>
            </div>
          </template>
        </v-tab-item>
        <!-- Archive -->
        <v-tab-item>
          <v-list v-if="archiveGroups.length > 0" class="py-0">
            <v-list-item
              v-for="(group, i) in archiveGroups"
              :key="i"
              class="divide"
              @click="navTo(group.id)"
            >
              <v-list-item-content>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ group.name }}
                    </div>
                    <div class="text-body-2 grey--text text--darken-2">
                      {{ group.course.name }} ({{ group.course.board }})
                    </div>
                  </div>
                  <div class="chip-col d-flex justify-center">
                    <v-chip label outlined small>
                      {{ group.count }} student{{ group.count | pluralize }}
                    </v-chip>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <p v-else class="pa-3 text-center">No archived classes</p>
        </v-tab-item>
      </v-tabs-items>
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
                    sm="5"
                    class="
                      d-flex
                      flex-column flex-sm-row
                      align-center
                      text-body-2
                    "
                  >
                    <div class="justify-date">
                      <span class="font-weight-medium fix-date mr-1"
                        >Start:</span
                      >
                      {{ assignment.start | date }}
                    </div>
                    <div>
                      <span class="font-weight-medium fix-date mr-1">Due:</span>
                      {{ assignment.dateDue | date }}
                    </div>
                  </v-col>
                  <v-col
                    v-if="$vuetify.breakpoint.name !== 'xs'"
                    cols="2"
                    sm="3"
                    class="d-flex justify-center align-center"
                  >
                    <v-chip v-if="assignment.live" label color="green" small>
                      Open
                    </v-chip>
                    <v-chip v-else label color="red" small> Past </v-chip>
                  </v-col>
                </v-row>
              </v-list-item-content>
              <v-list-item-action>
                <!-- On mobile, chip moves into item-action (less space) -->
                <v-list-item-action-text
                  v-if="$vuetify.breakpoint.name === 'xs'"
                  class="mt-2"
                >
                  <v-chip v-if="assignment.live" label color="green" small>
                    Open
                  </v-chip>
                  <v-chip v-else label color="red" small> Past </v-chip>
                </v-list-item-action-text>
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
                      class="ico-green"
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
    activeGroups() {
      return this.groups.filter((g) => g.active)
    },
    archiveGroups() {
      return this.groups.filter((g) => !g.active)
    },
  },
  mounted() {
    this.$store.commit(
      'app/setPageTitle',
      this.teacher ? 'Classes' : this.group.name
    )
  },
  methods: {
    navTo(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$router.push(`/group/${groupId}`)
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
</style>
