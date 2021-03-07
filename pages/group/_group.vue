<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n6 mt-sm-0">
          <v-card-title class="d-flex justify-space-between">
            Assignment{{ assignments.length | pluralize }} ({{
              assignments.length
            }})
            <v-btn elevation="0" color="primary" @click="createAssignment()">
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              {{
                $vuetify.breakpoint.name == 'xs'
                  ? 'Create'
                  : 'Create Assignment'
              }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader
              :loading="$fetchState.pending"
              type="list"
              width="66%"
              :types="{ list: 'list-item-two-line@5' }"
            >
              <v-list v-if="assignments.length > 0">
                <template v-for="(assignment, i) in assignments">
                  <v-list-item :key="i" nuxt :to="`/report/${assignment.id}`">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        assignment.name
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        Due {{ assignment.dateDue | date }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-menu offset-y>
                        <template #activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                            @click.prevent
                            @mousedown.stop
                            @touchstart.native.stop
                          >
                            <v-icon>{{ $icons.mdiDotsVertical }}</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <DeleteAssignment
                            :assignment-id="assignment.id"
                            :group-id="group.id"
                          />
                        </v-list>
                      </v-menu>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider
                    v-if="i < assignments.length - 1"
                    :key="assignment.id"
                  />
                </template>
              </v-list>
              <!-- Empty state -->
              <div v-else>
                <div id="empty" class="d-flex justify-center">
                  <v-img src="/no-assign.svg" max-width="100" />
                </div>
                <p class="text-body-1 font-weight-bold text-center mb-0">
                  No assignments yet
                </p>
                <p class="text-subtitle text-center">
                  Click create assignment to browse questions
                </p>
                <div class="d-flex justify-center">
                  <v-btn
                    elevation="0"
                    color="primary"
                    class="mb-10"
                    @click="createAssignment()"
                  >
                    Create assignment
                  </v-btn>
                </div>
              </div>
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
import DeleteAssignment from '@/components/teacher/DeleteAssignment'
import {
  mdiDotsVertical,
  mdiInformationOutline,
  mdiPlus,
  mdiBookOpenOutline,
} from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    DeleteAssignment,
  },
  layout: 'app',
  data() {
    return {
      assignments: [],
    }
  },
  async fetch() {
    const url = new URL(
      '/.netlify/functions/getAssignments',
      this.$config.baseURL
    )
    const data = await fetch(url, {
      body: JSON.stringify({
        secret: this.$store.state.user.secret,
        groupId: this.$route.params.group,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching assignments ${data.status}`)
    }
    this.assignments = await data.json()
  },
  head() {
    return {
      title: this.group.name,
    }
  },
  computed: {
    ...mapGetters({ group: 'groups/activeGroup' }),
  },
  created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
      mdiBookOpenOutline,
    }
  },
  mounted() {
    // Listen for refresh event
    // For example, when an assignment is deleted
    this.$nuxt.$on('refresh', () => {
      this.$fetch()
    })
  },
  methods: {
    createAssignment() {
      // Remember group when creating assignments
      this.$store.commit('assignments/setGroup', this.group.id)
      // Clear any questions selected for a previous group
      this.$store.commit('assignments/clearSelectedQuestions')
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>

<style scoped>
#empty {
  padding-top: 2em;
  padding-bottom: 2em;
}
</style>
